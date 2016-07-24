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
    def index(self):
        return [answer.to_dict() for answer in Answer.query().fetch()]

    def get(self, story_id, clue_id, answer_id):
        logging.info('Answer GET')
        answer = Answer.get_by_ids(story_id, clue_id, answer_id)
        if answer is None:
            abort(400, 'No Resource for that id')
        return answer.to_dict()

    def post(self, story_id, clue_id, answer_id, data):
        logging.info('Answer POST')
        answer_args = parse_args(data, required_answer_args)
        answer = Answer.from_ids(story_id, clue_id, answer_id)
        answer.populate(**answer_args)
        answer.put()
        return answer.to_dict()
