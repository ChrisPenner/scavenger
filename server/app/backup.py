import json

from webapp2 import RequestHandler

from app.models.answer import Answer
from app.models.clue import Clue
from app.models.story import Story


class BackupHandler(RequestHandler):
    def get(self):
        stories = [s.to_dict() for s in Story.query().fetch()]
        clues = [c.to_dict() for c in Clue.query().fetch()]
        answers = [a.to_dict() for a in Answer.query().fetch()]
        self.request.headers['Content-Type'] = 'application/json'
        self.response.body = json.dumps({
            'stories': stories,
            'clues': clues,
            'answers': answers,
        }, indent=2)
