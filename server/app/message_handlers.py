from app.models.message import Message
from base import BaseHandler


class StoryMessagesHandler(BaseHandler):
    def get(self, story_uid):
        story_uid = story_uid.upper()
        messages = Message.for_story(story_uid)
        self.render('logs.html', messages=messages)
