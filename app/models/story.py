from google.appengine.ext import ndb
from uuid import uuid4


class Answer(ndb.Model):
    pattern = ndb.StringProperty(required=True)
    next = ndb.StringProperty(required=True)
    uuid = ndb.StringProperty(required=True)

    def __init__(self, *args, **kwargs):
        super(Answer, self).__init__(*args, **kwargs)
        self.uuid = str(uuid4())


class Clue(ndb.Model):
    clue_id = ndb.StringProperty(required=True)
    text = ndb.TextProperty(required=True)
    answers = ndb.LocalStructuredProperty(Answer, repeated=True)
    hint = ndb.StringProperty()
    media_url = ndb.StringProperty()
    uuid = ndb.StringProperty(required=True)

    def __init__(self, id=None, *args, **kwargs):
        super(Clue, self).__init__(*args, **kwargs)
        self.uuid = str(uuid4())


class Story(ndb.Model):
    clues = ndb.LocalStructuredProperty(Clue, repeated=True)
    default_hint = ndb.StringProperty(required=True)
    name = ndb.StringProperty(required=True, indexed=True)
