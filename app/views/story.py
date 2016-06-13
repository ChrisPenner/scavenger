from collections import namedtuple

from webapp2 import RequestHandler, abort
from webapp2_extensions import restful_api, parse_args
from google.appengine.ext.ndb import Key

from app.models.story import Story

Arg = namedtuple('arg', ['key', 'type', 'required'])
required_story_args = [
    Arg('name', str, True),
    Arg('description', str, True),
    Arg('clues', dict, True),
    Arg('default_hint', str, True),
]


@restful_api('/application/json')
class StoryHandler(RequestHandler):
    def get(self, id):
        story = Story.get_by_id(id)
        if story is None:
            abort(400, 'No Resource for that id')
        return story.to_dict()

    def post(self, id):
        # if Story.get_by_id(id):
        #     abort(409, message='Record already exists')
        story_args = parse_args(self.request.params, required_story_args)
        story = Story(id=id, **story_args)
        story.put()
        return story.to_dict()

    def put(self, id):
        story_args = parse_args(self.request.params, required_story_args)
        story = Story(id=id, **story_args)
        story.put()
        return story.to_dict()

    def delete(self, id):
        Key(Story, id).delete()
        return "Success"
