from google.appengine.ext import ndb
from clue import Clue
from story import Story


class Answer(ndb.model):
    # id = ndb.IntegerProperty()
    # state = ndb.IntegerProperty(default=1)
    name = ndb.StringProperty()
    value = ndb.StringProperty()
    clue = ndb.KeyProperty(Clue)
    story = ndb.KeyProperty(Story)
