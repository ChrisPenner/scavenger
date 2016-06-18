from functools import partial
import re

from webapp2 import RequestHandler, abort

from twilio import twiml
from models.user import User
from models.group import Group
from models.story import Story
from messages import HOW_TO_START, STORY_NOT_FOUND, NO_GROUP_FOUND, \
    ALREADY_IN_GROUP, JOINED_GROUP, RESTARTED, END_OF_STORY, SEPARATOR_STRING, start_new_story

CLUE = 'CLUE'
HINT = 'HINT'

START_STORY = 'START_STORY'
JOIN_GROUP = 'JOIN_GROUP'
RESTART = 'RESTART'
ANSWER = 'ANSWER'

regex_match = partial(re.search, flags=re.IGNORECASE | re.UNICODE)


def twiml_response(user, message_type, messages):
    media_urls = [m['media_url'] for m in messages
                  if not isinstance(m, basestring) and m.get('media_url')]
    messages = [get_text_message_from_clue(m) for m in messages]
    recipients = [user.phone]
    joined_messages = SEPARATOR_STRING.join(messages)
    if user.group and user.group.users and message_type == CLUE or message_type == HINT:
        recipients = user.group.users
    resp = twiml.Response()
    for recipient in recipients:
        message = twiml.Message(msg=joined_messages, to=recipient)
        for media_url in media_urls:
            message.append(twiml.Media(url=media_url))
        resp.append(message)
    return str(resp)


def get_text_message_from_clue(message):
    if isinstance(message, basestring):
        return message
    else:  # Must be clue
        return message['text']


def split_data(data):
    user_data = {}
    group_data = {}
    for key, value in data.iteritems():
        if key.startswith('user_'):
            user_data[key] = value
        elif key.startswith('group_'):
            group_data[key] = value
    return user_data, group_data


def format_response(message, user):
    data = {}
    data.update(user.data)
    if user.group:
        data.update(user.group.data)
    message['text'] = message['text'].format(**data)
    return message


def determine_message_type(message):
    if message.lower().startswith('start'):
        return START_STORY
    elif message.lower().startswith('join'):
        return JOIN_GROUP
    elif message.lower().startswith('restart'):
        return RESTART
    else:
        return ANSWER


def perform_action(message_type, message, user):
    if message_type == START_STORY:
        return start_story(message, user)
    elif message_type == JOIN_GROUP:
        return join_group(message, user)
    if (not user.group) or (not user.group.story):
        return [HOW_TO_START]
    elif message_type == RESTART:
        return restart(user)
    else:  # ANSWER
        return answer(message, user)


def start_story(message, user):
    match = regex_match(r'^start (?P<code>.+)', message.lower())
    code = match.groupdict().get('code')
    story = Story.get_by_id(code.upper()) if code else None
    if not story:
        return [STORY_NOT_FOUND]
    group_code = Group.gen_code()
    group = Group(id=group_code, current_clue_key='start', story_key=story.key, user_keys=[user.key])
    user.group = group
    return [start_new_story(group_code),
            user.group.current_clue]


def join_group(message, user):
    """ Join group by code """
    match = regex_match(r'^join (?P<code>.+)', message.lower())
    code = match.groupdict().get('code')
    if not code or not Group.get_by_id(code):
        return [NO_GROUP_FOUND]
    if user.group_code == code:
        return [ALREADY_IN_GROUP]
    group = Group.get_by_id(code.upper())
    group.user_keys.append(user.key)
    user.group = group
    return [JOINED_GROUP, user.group.current_clue]


def restart(user):
    user.group.current_clue_key = 'start'
    user.group.data = {}
    user.data = {}
    return [RESTARTED, user.group.current_clue]


def get_next_clue(message, user):
    next_clue, answer_data = next(((next_clue, regex_match(pattern, message).groupdict())
                                   for pattern, next_clue in user.group.current_clue['answers']
                                   if regex_match(pattern, message)), (None, None))
    return next_clue, answer_data


def answer(message, user):
    if (not user.group.current_clue) or (not user.group.current_clue['answers']):
        return [END_OF_STORY]
    next_clue, answer_data = get_next_clue(message, user)
    if next_clue:
        user.group.current_clue = next_clue
        user_data, group_data = split_data(answer_data)
        user.data.update(user_data)
        user.group.data.update(group_data)
        return [user.group.current_clue]
    # They got the answer wrong - send them a hint
    if user.group.current_clue.get('hint'):
        return [user.group.current_clue.get('hint')]
    return [user.group.story.default_hint]


class TwilioHandler(RequestHandler):
    def post(self):
        if not self.request.get('Body') or not self.request.get('From'):
            abort(400, 'Body and From params required')

        message = self.request.get('Body').strip()
        from_phone = self.request.get('From')

        user = User.get_by_id(from_phone) or User(id=from_phone)

        message_type = determine_message_type(message)
        responses = perform_action(message_type, message, user)
        responses = [format_response(r, user) for r in responses]
        self.response.body = twiml_response(user, message_type, responses)
        self.response.headers['Content-Type'] = 'text/xml'
        if user.group:
            user.group.put()
        user.put()
        return
