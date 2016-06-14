from uuid import uuid4

from google.appengine.ext import ndb
from app.models.user import User


class Group(ndb.Model):
    name = ndb.StringProperty()
    code = ndb.StringProperty()
    data = ndb.JsonProperty(default={})
    story_key = ndb.KeyProperty("Story")
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    hints_used = ndb.IntegerProperty(default=0)
    completed_at = ndb.DateTimeProperty()
    current_clue_key = ndb.StringProperty(required=True)
    user_keys = ndb.KeyProperty(User, repeated=True)

    def __init__(self, *args, **kwargs):
        code = uuid4().hex[:6].upper()
        while Group.get_by_id(code):
            code = uuid4().hex[:6].upper()
        super(Group, self).__init__(id=code, *args, **kwargs)

    @property
    def users(self):
        return [user.get() for user in self.user_keys]

    @property
    def current_clue(self):
        return self.story.clues[self.current_clue_key]

    @current_clue.setter
    def current_clue(self, value):
        self.current_clue_key = value

    @property
    def story(self):
        return self.story_key.get()

    @story.setter
    def story(self, value):
        self.story_key = ndb.Key("Story", value.id)
