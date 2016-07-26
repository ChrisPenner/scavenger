import logging
from collections import namedtuple

from webapp2 import RequestHandler, abort
from webapp2_extensions import restful_api, parse_args

from app.models.story import Story

Arg = namedtuple('arg', ['key', 'type', 'required'])
required_story_args = [
    Arg('clues', list, True),
    Arg('default_hint', str, True),
]


@restful_api('/application/json')
class StoryHandler(RequestHandler):
    def index(self):
        stories = [story.to_dict() for story in Story.query().fetch()]
        return {story['story_id']: story for story in stories}

    def get(self, story_id):
        story = Story.get_by_story_id(story_id)
        if story is None:
            abort(400, 'No Resource for that id')
        return story.to_dict()

    def post(self, story_id, data):
        logging.info('story_id', 'data', story_id, data)
        story_args = parse_args(data, required_story_args)
        story = Story.from_id(story_id=story_id, **story_args)
        story.put()
        return story.to_dict()
