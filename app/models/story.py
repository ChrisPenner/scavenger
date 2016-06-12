from google.appengine.ext import ndb
from clue import Clue
from hint import Hint


class Hunt(ndb.model):
    # id = ndb.IntegerProperty()
    # state = ndb.IntegerProperty(default=1)
    name = ndb.StringProperty()
    description = ndb.StringProperty()
    first_clue = ndb.KeyProperty(Clue)
    default_hint = ndb.KeyProperty(Hint)
    end_message = ndb.StringProperty()
    code = ndb.StringProperty()
    max_users = ndb.IntegerProperty()
    type = ndb.StringProperty()
