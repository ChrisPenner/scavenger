from functools import partial
import re
import logging
from collections import namedtuple

from google.appengine.ext import ndb
from webapp2 import RequestHandler

from app.models.story_code import StoryCode
from models.clue import Clue
from twilio import twiml
from models.user import User
from models.group import Group
from models.message import Message
from messages import HOW_TO_START, STORY_NOT_FOUND, NO_GROUP_FOUND, \
    ALREADY_IN_GROUP, JOINED_GROUP, RESTARTED, CODE_ALREADY_USED, START_INSTRUCTIONS, \
    JOIN_GROUP_INSTRUCTIONS, INTRO_INSTRUCTIONS

# Message Types
START_STORY = 'START_STORY'
JOIN_GROUP = 'JOIN_GROUP'
RESTART = 'RESTART'
ANSWER = 'ANSWER'
REPEAT_CLUE = 'REPEAT_CLUE'

# Response Types
INFO = 'INFO'
JOINED = 'JOINED'
CLUE = 'CLUE'
HINT = 'HINT'

Result = namedtuple('Result', ['response_type', 'messages', 'user', 'group'])

regex_match = partial(re.search, flags=re.IGNORECASE | re.UNICODE)
regex_dotall = partial(re.search, flags=re.IGNORECASE | re.UNICODE | re.DOTALL)


def twiml_response(user, group, response_type, messages):
    recipients = [user.phone]
    if group and group.users and (response_type == CLUE or response_type == HINT):
        recipients = group.users
    resp = twiml.Response()
    for recipient in recipients:
        for message in messages:
            m = twiml.Message(msg=message.text, to=recipient, sender=message.sender or None)
            if message.media_url:
                m.append(twiml.Media(url=message.media_url))
            resp.append(m)
    return str(resp)


def split_data(data):
    user_data = {}
    group_data = {}
    for key, value in data.iteritems():
        if key.startswith('user_'):
            user_data[key] = value
        elif key.startswith('group_'):
            group_data[key] = value
    return user_data, group_data


def format_message(message, user, group):
    data = {}
    data.update(user.data)
    if group:
        data.update(group.data)
    message.text = message.text.format(**data)
    return message


def determine_message_type(message):
    text = message.lower()
    if text.startswith('start'):
        return START_STORY
    elif text.startswith('join'):
        return JOIN_GROUP
    elif text.startswith('restart'):
        return RESTART
    elif text.startswith('clue'):
        return REPEAT_CLUE
    else:
        return ANSWER


def perform_action(message_type, message, user, group):
    if message_type == START_STORY:
        return start_story(message, user, group)
    elif message_type == JOIN_GROUP:
        return join_group(message, user, group)
    elif message_type == REPEAT_CLUE:
        return repeat_clue(message, user, group)
    if not user.group_uid:
        return Result(response_type=INFO, messages=[HOW_TO_START], user=user, group=None)
    elif message_type == RESTART:
        return restart(user, group)
    else:  # ANSWER
        return answer(message, user, group)


def repeat_clue(message, user, group):
    logging.info("Repeating clue")
    return Result(
        response_type=INFO,
        messages=[group.clue],
        user=user,
        group=group,
    )


def start_story(message, user, group):
    match = regex_dotall(r'^start (?P<code>.+)', message.text.lower())
    if not match:
        logging.info("No start code provided")
        return Result(response_type=INFO, messages=[START_INSTRUCTIONS], user=user, group=group)
    code = match.groupdict().get('code')
    story_code = StoryCode.build_key(code).get()
    if not story_code:
        logging.info("Couldn't find story for code: %s", code)
        return Result(response_type=INFO, messages=[STORY_NOT_FOUND], user=user, group=group)
    if story_code.used:
        logging.info("Story code already used: %s", code)
        return Result(response_type=INFO, messages=[CODE_ALREADY_USED], user=user, group=group)
    story_code.use()
    start_clue = Clue.get_by_id('{}:START'.format(story_code.story_uid))
    if not start_clue:
        raise ValueError('Story {} has no clue named "START"'.format(story_code.story_uid))
    group_code = Group.gen_uid()
    group = Group.from_uid(group_code, clue_uid=start_clue.uid, story_uid=story_code.story_uid, user_keys=[user.key])

    return Result(
        response_type=INFO,
        messages=[INTRO_INSTRUCTIONS, start_clue],
        user=user,
        group=group,
    )


def join_group(message, user, group):
    """ Join group by code """
    match = regex_match(r'^join (?P<group_uid>.+)', message.text.lower())
    if not match:
        logging.info("No group code provided")
        return Result(response_type=INFO, messages=[JOIN_GROUP_INSTRUCTIONS], user=user, group=group)
    group_uid = match.groupdict().get('group_uid')
    if user.group_uid == group_uid:
        logging.info("Already in group for group_uid: %s", group_uid)
        return Result(response_type=INFO, messages=[ALREADY_IN_GROUP], user=user, group=group)
    if not group_uid:
        logging.info("Need to specify a group_uid")
        return Result(response_type=INFO, messages=[NO_GROUP_FOUND], user=user, group=None)
    group = Group.get_by_id(group_uid)
    if not group:
        logging.info("Couldn't find group for group_uid: %s", group_uid)
        return Result(response_type=INFO, messages=[NO_GROUP_FOUND], user=user, group=None)
    group.user_keys.append(user.key)
    user.group_uid = group.uid
    clue = group.clue
    return Result(response_type=JOINED, messages=[JOINED_GROUP, clue], user=user, group=group)


def restart(user, group):
    logging.info("Restarting story")
    group.restart()
    user.restart()
    clue = group.clue
    return Result(response_type=INFO, messages=[RESTARTED, clue], user=user, group=group)


def get_next_clue(message, answers):
    next_clue, answer_data = next(
        ((answer.next_clue, regex_match(answer.pattern, message.text).groupdict())
         for answer in answers
         if regex_match(answer.pattern, message.text)
         and (message.media_url or not answer.require_media)
         and (answer.receiver == message.receiver or not answer.receiver)
         ),
        (None, None))
    return next_clue, answer_data


def answer(message, user, group):
    clue = group.clue
    if clue.is_endpoint:
        return Result(response_type=CLUE, messages=[Message(text=group.story.end_message)], user=user, group=group)
    answers = group.clue.answers
    next_clue, answer_data = get_next_clue(message, answers)
    if next_clue:
        group.clue_uid = next_clue
        user_data, group_data = split_data(answer_data)
        user.data.update(user_data)
        group.data.update(group_data)
        return Result(response_type=CLUE, messages=[group.clue], user=user, group=group)
    # They got the answer wrong - send them a hint
    logging.info('Sending hint')
    if clue.hint:
        return Result(response_type=HINT, messages=[Message(text=clue.hint)], user=user, group=group)
    return Result(response_type=HINT, messages=[Message(text=group.story.default_hint)], user=user, group=group)


class TwilioHandler(RequestHandler):
    def post(self):
        if self.request.POST.get('Body') is None or self.request.POST.get('From') is None:
            logging.error('Body and From params required')
            return self.abort(400, 'Body and From params required')

        user_message = Message(
            text=self.request.POST.get('Body').strip(),
            receiver=self.request.POST.get('To'),
            sender=self.request.POST.get('From'),
            media_url=self.request.POST.get('MediaUrl0'),
        )

        from_phone = self.request.get('From')
        logging.info('Received text from %s with media: %s message:\n%s', from_phone, user_message.media_url, user_message.text)

        user = User.get_by_id(from_phone)
        if user:
            logging.info('Found existing user for %s', from_phone)
        else:
            logging.info('Creating new user for %s', from_phone)
            user = User(id=from_phone)

        message_type = determine_message_type(user_message.text)
        logging.info('Message of type: %s', message_type)
        group = user.group
        response_type, messages, user, group = perform_action(message_type, user_message, user, group)
        responses = [format_message(m, user, group) for m in messages]
        logging.info('Responding with: %s', responses)
        self.response.body = twiml_response(user, group, response_type, responses)
        self.response.headers['Content-Type'] = 'text/xml'
        logging.info('Responding: %s', self.response.body)

        user_message.story_uid = group.story_uid if group else None
        user_message.group_uid = group.uid if group else None
        user_message.put()

        ndb.put_multi([Message(receiver=from_phone,
                               sender=m.sender or None,
                               text=m.text,
                               media_url=m.media_url,
                               group_uid= group.uid if group else None,
                               story_uid=group.story_uid if group else None)
                       for m in responses])

        if group:
            group.put()
            user.group_uid = group.uid
        else:
            user.group_uid = None
        user.put()
