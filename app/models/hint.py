from google.appengine.ext import ndb
from clue import Clue
from story import Story


class Hint(ndb.model):
    # id = ndb.IntegerProperty()
    # state = ndb.IntegerProperty(default=1)
    name = ndb.StringProperty()
    value = ndb.StringProperty()
    story = ndb.KeyProperty(Story)
    clue = ndb.KeyProperty(Clue)
    priority = ndb.IntegerProperty(default=5)
    uses_lifeline = ndb.IntegerProperty(default=1)
