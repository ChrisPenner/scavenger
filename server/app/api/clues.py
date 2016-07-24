from collections import namedtuple
import logging

from webapp2 import RequestHandler, abort
from webapp2_extensions import restful_api, parse_args

from app.models.clue import Clue

Arg = namedtuple('arg', ['key', 'type', 'required'])
required_clue_args = [
    Arg('text', str, True),
    Arg('hint', str, False),
    Arg('media_url', str, False),
]


@restful_api('/application/json')
class ClueHandler(RequestHandler):
    def index(self):
        return [clue.to_dict() for clue in Clue.query().fetch()]

    def get(self, story_id, clue_id):
        logging.info('Clue GET')
        return 'Hey!'
        clue = Clue.get(story_id, clue_id)
        if clue is None:
            abort(400, 'No Resource for that id')
        return clue.to_dict()

    def post(self, story_id, clue_id, data):
        logging.info('Clue POST')
        clue_args = parse_args(data, required_clue_args)
        clue = Clue(story_id=story_id, clue_id=clue_id, **clue_args)
        clue.put()
        return clue.to_dict()
