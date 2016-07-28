import logging
from collections import namedtuple

from webapp2 import RequestHandler, abort
from webapp2_extensions import restful_api, parse_args

from app.models.clue import Clue

Arg = namedtuple('arg', ['key', 'type', 'required'])
required_clue_args = [
    Arg('text', str, True),
    Arg('hint', str, False),
    Arg('answers', list, False),
    Arg('media_url', str, False),
]


@restful_api('/application/json')
class ClueHandler(RequestHandler):
    def index(self):
        clues = [clue.to_dict() for clue in Clue.query().fetch()]
        return {clue['uid']: clue for clue in clues}

    def get(self, uid):
        clue = Clue.get_by_id(uid)
        if clue is None:
            abort(400, 'No Resource for that id')
        return clue.to_dict()

    def post(self, uid, data):
        clue_args = parse_args(data, required_clue_args)
        clue = Clue.from_id(uid=uid, **clue_args)
        clue.put()
        return clue.to_dict()
