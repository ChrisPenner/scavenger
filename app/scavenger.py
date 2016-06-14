from webapp2 import RequestHandler, abort

from webapp2_extensions import restful_api

from twilio import twiml
from models.user import User
from models.group import Group
from models.story import Story
import re

ALL = 'ALL'
USER = 'USER'
CLUE = 'CLUE'
HINT = 'HINT'


def twiml_response(f):
    def wrapped(self, *args, **kwargs):
        message = f(self, *args, **kwargs)
        recipients = [self.user.phone]
        if message.get('type') == CLUE:
            message['texts'] = [format_clue(m, self.user.data, self.group.data)
                                for m in message['texts']]
        if (message.get('type') == CLUE or message.get('type') == HINT) and self.group:
            recipients = [user.phone for user in self.group.users]
        resp = twiml.Response()
        for recipient in recipients:
            for m in message['texts']:
                resp.message(str(m), to=recipient)
        return str(resp)
    return wrapped


def split_data(data):
    user_data = {}
    group_data = {}
    for key, value in data.iteritems():
        if key.startswith('user_'):
            user_data[key] = value
        elif key.startswith('group_'):
            group_data[key] = value
    return user_data, group_data


def format_clue(message, user_data, group_data):
    data = {}
    data.update(user_data)
    data.update(group_data)
    return message.format(**data)


@restful_api('text/xml')
class TwilioHandler(RequestHandler):
    @twiml_response
    def post(self):
        if not self.request.get('Body') or not self.request.get('From'):
            abort(400, 'Body and From params required')

        response = self.check_setup()
        if response:
            return response
        if not self.user.group:
            return {
                'texts': ["Hello! I don't recognize you, text \"start %\" "
                          "where % is your adventure's code if you'd like to begin!"],
            }

        response = self.match_global_message()
        if response:
            return response

        return self.answer_clue()

    def __init__(self, *args, **kwargs):
        super(TwilioHandler, self).__init__(*args, **kwargs)
        self.user = User.get_by_id(self.from_phone)
        if not self.user:
            self.user = User(id=self.from_phone)
            self.user.put()
        self.group = self.user.group

    @property
    def clue(self):
        return self.group.current_clue

    @property
    def from_phone(self):
        return self.request.get('From')

    @property
    def message(self):
        message = self.request.get('Body').strip().lower()
        if self.has_media:
            message = 'has-media:' + message
        return message

    @property
    def has_media(self):
        return bool(self.request.get('MediaUrl0'))

    def check_setup(self):
        commands = {
            r'^start (?P<code>.+)': self.start_story,
            r'^join (?P<code>.+)': self.join_group,
        }
        for pattern, action in commands.iteritems():
            match = re.match(pattern, self.message)
            if match:
                self.ensure_user()
                return action(match.groupdict()['code'])

    def join_group(self, code):
        """ Join group by code """
        if not code or not Group.from_code(code):
            return {'texts': ["Sorry I don't know that group!"]}
        if self.user.group_code == code.upper():
            return {'texts': ["You're already a part of that group!",
                              self.group.current_clue['text']]}
        self.group = Group.from_code(code)
        self.group.user_keys.append(self.user.key)
        self.group.put()
        self.user.group_code = code.upper()
        print self.user.group_code, code.upper()
        self.user.put()
        return {'texts': ["You've joined the group! Glad to have you!",
                          self.group.current_clue['text']]}

    def match_global_message(self):
        commands = {
            r'quit group': self.quit_group,
            r'restart': self.restart,
            r'clue': lambda: self.clue,
        }

        action = next((action for pattern, action in commands.iteritems() if re.match(pattern, self.message)), None)
        if action:
            return action()
        return None

    def ensure_user(self):
        if not self.user:
            self.user = User(id=self.from_phone)
            self.user.put()

    def quit_group(self):
        self.user.group = None
        self.user.put()
        return {'texts': ["You've left your group"]}

    def start_story(self, code):
        """ Start a Story for a given code """
        story = Story.get_by_id(code)
        if not story:
            return {'texts': ["Sorry, can't find any adventures by that name, are you sure it's spelled correctly?"]}
        self.group = Group(current_clue_key='start', story_key=story.key, user_keys=[self.user.key])
        self.group.put()
        self.user.group_code = self.group.key.id()
        self.user.put()
        return {
            'texts': ["You've started your adventure! Your friends can text 'join {}' to join your group!".format(self.group.key.id()),
                      self.group.current_clue['text']],
            'type': CLUE,
        }

    def give_hint(self):
        hint = next(self.clue.hints, None)
        if hint is not None:
            return {'texts': [hint.text], 'type': HINT}
        else:
            return {'texts': [self.story.default_hint.text], 'type': HINT}

    def restart(self):
        self.group.current_clue = 'start'
        self.group.data = {}
        self.group.put()
        self.user.data = {}
        self.user.put()
        return {'texts': [self.group.current_clue['text']], 'type': CLUE}

    def answer_clue(self):
        if not self.clue['answers']:
            return {'texts': ["Looks like you've hit the end of the story, text 'restart' to try again!"]}
        next_clue, answer_data = next(((next_clue, re.match(pattern, self.message).groupdict())
                                       for pattern, next_clue in self.clue['answers']
                                       if re.match(pattern, self.message)), (None, None))
        if next_clue:
            self.group.current_clue = next_clue
            user_data, group_data = split_data(answer_data)
            self.user.data.update(user_data)
            self.user.put()
            self.group.data.update(group_data)
            self.group.put()
            return {'texts': [self.group.current_clue['text']], 'type': CLUE}
        # They got the answer wrong - send them a hint
        if self.clue['hint']:
            return {'texts': [self.clue['hint']], 'type': HINT}
        return {'texts': [self.story.default_hint], 'type': HINT}
