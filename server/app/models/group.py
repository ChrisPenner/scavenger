from uuid import uuid4

from google.appengine.ext import ndb
from app.models.user import User


class Group(ndb.Model):
    name = ndb.StringProperty()
    code = ndb.StringProperty()
    uid = ndb.StringProperty()
    data = ndb.JsonProperty(default={})
    story_uid = ndb.StringProperty()
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    hints_used = ndb.IntegerProperty(default=0)
    completed_at = ndb.DateTimeProperty()
    clue_uid = ndb.StringProperty()
    user_keys = ndb.KeyProperty(User, repeated=True)

    @staticmethod
    def gen_code():
        code = uuid4().hex[:6].upper()
        while Group.get_by_id(code):
            code = uuid4().hex[:6].upper()
        return code

    @property
    def users(self):
        return [user.get() for user in self.user_keys]

    @property
    def current_clue(self):
        return Clue.get_by_id(self.clue_uid)

    @current_clue.setter
    def current_clue(self, clue):
        if isinstance(story, basestring):
            self.clue_uid = clue
        else:
            self.clue_uid = clue.uid

    @property
    def story(self):
        return Story.get_by_id(story_uid)

    @story.setter
    def story(self, story):
        if isinstance(story, basestring):
            self.story_uid = story
        else:
            self.story_uid = story.uid
