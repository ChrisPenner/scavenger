from google.appengine.ext import ndb
from story import Story


class Clue(ndb.model):
    # id = ndb.IntegerProperty()
    # state = ndb.IntegerProperty(default=1)
    name = ndb.StringProperty()
    value = ndb.StringProperty()
    story = ndb.ReferenceProperty(Story)
