from collections import namedtuple
import logging

from webapp2 import RequestHandler, abort
from webapp2_extensions import restful_api, parse_args

from app.models.answer import Answer

Arg = namedtuple('arg', ['key', 'type', 'required'])
required_answer_args = [
    Arg('pattern', str, True),
    Arg('next_clue', str, False),
]


@restful_api('/application/json')
class AnswerHandler(RequestHandler):
    def index(self, clue_id):
        print clue_id
        answers = [answer.to_dict() for answer in Answer.query(Answer.clue_id == clue_id).fetch()]
        return {answer['uid']: answer for answer in answers}

    def get(self, answer_id):
        answer = Answer.build_key(answer_id).get()
        if answer is None:
            abort(400, 'No Resource for that id')
        return answer.to_dict()

    def post(self, answer_id, data):
        answer_args = parse_args(data, required_answer_args)
        answer = Answer.from_id(answer_id)
        answer.populate(**answer_args)
        answer.put()
        return answer.to_dict()
