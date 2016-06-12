from flask import request
from flask_restful import Resource
from twilio import twiml
from models import User, Group, Story
import re


def twiml_response(f):
    def wrapped(*args, **kwargs):
        message = f(*args, **kwargs)
        resp = twiml.Response()
        resp.message(str(message))
        # recipients = [user.phone for user in self.group.users]
        return str(resp)
    return wrapped


class TwilioHandler(Resource):
    @twiml_response
    def get(self):
        if not self.user:
            return ("Hello! I don't recognize you, text \"start %\""
                    "where % is your adventure's code if you'd like to begin!")
        response = self.match_global_message()
        if response:
            return response
        return self.answer_clue()

    @property
    def user(self):
        if self._user:
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
        return request.values.get('From')

    @property
    def message(self):
        return request.values.get('Body').strip().lower()

    @property
    def has_media(self):
        return bool(request.values.get('MediaUrl0'))

    def join_group(self):
        """ Join group by code """
        match = re.search("^join (.+)", self.message)
        group_code = next(match.groups()).strip().lower() if match else None
        if not group_code or not Group.get_by_id(group_code):
            return "Sorry I don't know that group!"
        self.user.group = Group.get_by_id(group_code)
        self.user.put()
        return "You've joined the group! Glad to have you!"

    def match_global_message(self):
        commands = {
            r'/^quit\s?group/i': self.quit_group,
            r'/^start\.?/i': self.start,
            r'/^hint/i': self.give_hint,
            r'/^restart/i': self.restart,
            r'/^clue/i': lambda: self.clue,
            r'/^join/i': self.join_group,
        }

        action = next(action for pattern, action in commands.iteritems() if re.match(pattern, self.message))
        return action()

    def quit_group(self):
        self.user.group = None
        self.user.put()
        return "You've left your group"

    def start_story(self):
        """ Start a Story for a given code """
        user = self.user
        story_code = next(re.find_all(r"start (.+)", self.message), None)
        story = Story.get_by_id(story_code)
        if not story:
            return "Sorry, can't find anything by that name, are you sure it's spelled correctly?"
        group = Group(story=story)
        group.put()
        user.group = group
        user.put()
        return user.group.clue

    def give_hint(self):
        hint = next(self.clue.hints, None)
        if hint is not None:
            return hint.text
        else:
            return self.story.default_hint.text

    def restart(self):
        self.group.current_clue = self.story.first_clue
        return self.group.current_clue

    def answer_clue(self):
        answer = self.clue.match_answer(self.message, has_media=self.has_media)
        if answer:
            self.group.current_clue = answer.next_clue
            self.group.put()
            return self.group.current_clue
        else:
            # They got the answer wrong - send them a hint
            # If we don't have hints then suggest that they skip the question
            hint = next(self.clue.hints, None)
            if hint is not None:
                return hint
            else:
                return self.story.default_hint
