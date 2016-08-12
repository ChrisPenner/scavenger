from uuid import uuid4

from google.appengine.ext import ndb

from app.models.clue import Clue
from app.models.clue import Story


class Group(ndb.Model):
    uid = ndb.StringProperty(required=True)
    data = ndb.JsonProperty(default={})
    story_uid = ndb.StringProperty(required=True)
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    hints_used = ndb.IntegerProperty(default=0)
    completed_at = ndb.DateTimeProperty()
    clue_uid = ndb.StringProperty(required=True)
    user_keys = ndb.KeyProperty('User', repeated=True)

    def restart(self):
        self.data = {}
        self.clue_uid = "{}:{}".format(self.story_uid, 'START')

    @classmethod
    def gen_uid(cls):
        uid = uuid4().hex[:6].upper()
        while cls.get_by_id(uid):
            uid = uuid4().hex[:6].upper()
        return uid

    @classmethod
    def get_by_id(cls, id):
        if not id:
            return None
        return super(Group, cls).get_by_id(id.upper())

    @classmethod
    def from_uid(cls, uid, **kwargs):
        return Group(id=uid, uid=uid, **kwargs)

    @property
    def users(self):
        return ndb.get_multi(self.user_keys)

    @property
    def current_clue(self):
        return Clue.get_by_id(self.clue_uid)

    @current_clue.setter
    def current_clue(self, clue):
        if isinstance(clue, basestring):
            self.clue_uid = clue.upper()
        else:
            self.clue_uid = clue.uid

    @property
    def story(self):
        return Story.get_by_id(self.story_uid)

    @story.setter
    def story(self, story):
        if isinstance(story, basestring):
            self.story_uid = story.upper()
        else:
            self.story_uid = story.uid
