import json

from flask_restful import Resource, reqparse, abort
from google.appengine.ext.ndb import Key

from app.models.story import Story

parser = reqparse.RequestParser()
parser.add_argument('name', type=str,  required=True)
parser.add_argument('description', type=str,  required=True)
parser.add_argument('clues', type=dict, required=True)
parser.add_argument('default_hint', type=str,  required=True)


class StoryHandler(Resource):
    def get(self, id):
        story = Story.get_by_id(id)
        if story is None:
            abort(400, message='Record not found')
        return story.to_dict()

    def post(self, id):
        if Story.get_by_id(id):
            abort(409, message='Record already exists')
        story_args = parser.parse_args()
        story = Story(id=id, **story_args)
        story.put()
        return story.to_dict()

    def put(self, id):
        story_args = parser.parse_args()
        story = Story(id=id, **story_args)
        story.put()
        return story.to_dict()

    def delete(self, id):
        Key(Story, id).delete()
        return "Success"
