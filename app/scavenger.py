from webapp2 import RequestHandler

from twilio import twiml
from models.user import User
from models.group import Group
from models.story import Story
import re


def twiml_response(f):
    def wrapped(*args, **kwargs):
        message = f(*args, **kwargs)
        if isinstance(message, tuple):
            return str(message)
        resp = twiml.Response()
        resp.message(str(message))
        # recipients = [user.phone for user in self.group.users]
        return str(resp)
    return wrapped


class TwilioHandler(RequestHandler):
    @twiml_response
    def post(self):
        if not self.request.get('Body') or not self.request.get('From'):
            return 'Body and From params required', 400

        response = self.check_setup()
        if response:
            return response
        if not self.user:
            return ("Hello! I don't recognize you, text \"start %\""
                    "where % is your adventure's code if you'd like to begin!")

        response = self.match_global_message()
        if response:
            return response

        return self.answer_clue()

    @property
    def user(self):
        if hasattr(self, '_user'):
            return self._user
        self._user = User.get_by_id(self.from_phone)
        return self._user

    @property
    def group(self):
        return self.user.group

    @property
    def clue(self):
        return self.group.current_clue

    @property
    def from_phone(self):
        return self.request.get('From')

    @property
    def message(self):
        return self.request.get('Body').strip().lower()

    @property
    def has_media(self):
        return bool(self.request.get('MediaUrl0'))

    def check_setup(self):
        match = re.match('^start (?P<code>.+)', self.message)
        if match:
            return self.start_story(match.groupdict()['code'])
        match = re.match('^join (?P<code>.+)', self.message)
        if match:
            return self.join_group(match.groupdict()['code'])

    def join_group(self, code):
        """ Join group by code """
        if not code or not Group.get_by_id(code):
            return "Sorry I don't know that group!"
        self.user.group = Group.get_by_id(code)
        self.user.put()
        return "You've joined the group! Glad to have you!"

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

    def quit_group(self):
        self.user.group = None
        self.user.put()
        return "You've left your group"

    def start_story(self, code):
        """ Start a Story for a given code """
        user = self.user
        if not user:
            group = Group()
            user = User(id=self.from_phone)

        story = Story.get_by_id(code)
        if not story:
            return "Sorry, can't find any adventures by that name, are you sure it's spelled correctly?"
        group = Group(current_clue_key='first_clue', story_key=story.key)
        group.put()
        user.group_key = group.key
        user.put()
        return user.group.current_clue['text']

    def give_hint(self):
        hint = next(self.clue.hints, None)
        if hint is not None:
            return hint.text
        else:
            return self.story.default_hint.text

    def restart(self):
        self.group.current_clue = 'first_clue'
        self.group.put()
        return self.group.current_clue['text']

    def answer_clue(self):
        if not self.clue['answers']:
            return "Looks like you've hit the end of the story, text 'restart' to try again!"
        next_clue = next((next_clue for pattern, next_clue in self.clue['answers']
                         if re.match(pattern, self.message)), None)
        if next_clue:
            self.group.current_clue = next_clue
            self.group.put()
            return self.group.current_clue['text']
        # They got the answer wrong - send them a hint
        if self.clue['hint']:
            return self.clue['hint']
        return self.story.default_hint
