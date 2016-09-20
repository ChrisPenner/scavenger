from uuid import uuid4

from google.appengine.ext import ndb
from webapp2_extensions import serialize_datetime

class Message(ndb.Model):

    def __init__(self, *args, **kwargs):
        super(Message, self).__init__(*args, **kwargs)
        if not self.key:
            self.key = ndb.Key(self.__class__, uuid4().hex)

    SERIALIZERS = [serialize_datetime]

    uid = ndb.ComputedProperty(lambda s: s.key.id())
    text = ndb.TextProperty(required=True)
    media_url = ndb.StringProperty()
    sender = ndb.StringProperty()
    receiver = ndb.StringProperty()
    group_uid = ndb.StringProperty()
    story_uid = ndb.StringProperty()
    sent = ndb.DateTimeProperty(auto_now_add=True)

    @classmethod
    def for_story(cls, story_uid, limit=1000):
        return cls.query(Message.story_uid == story_uid).order(-Message.sent).fetch(limit=limit)

    @classmethod
    def for_group(cls, group_uid, limit=1000):
        return cls.query(Message.group_uid == group_uid).order(-Message.sent).fetch(limit=limit)

    def _pre_put_hook(self):
        if not self.key:
            self.key = ndb.Key(uuid4().hex)
