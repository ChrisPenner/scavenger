from google.appengine.ext import ndb
from clue import Clue


class Hunt(ndb.model):
    # id = ndb.IntegerProperty()
    # state = ndb.IntegerProperty(default=1)
    name = ndb.StringProperty()
    description = ndb.StringProperty()
    first_clue = ndb.ReferenceProperty(Clue)
    end_message = ndb.StringProperty()
    default_hint = ndb.StringProperty
    code = ndb.StringProperty()
    max_users = ndb.IntegerProperty()
    type = ndb.StringProperty()
