from google.appengine.ext import ndb
from clue import Clue
from story import Story


class Hint(ndb.model):
    # id = ndb.IntegerProperty()
    # state = ndb.IntegerProperty(default=1)
    name = ndb.StringProperty()
    value = ndb.StringProperty()
    story = ndb.ReferenceProperty(Story)
    clue = ndb.ReferenceProperty(Clue)
    priority = ndb.IntegerProperty(default=5)
    uses_lifeline = ndb.IntegerProperty(default=1)
