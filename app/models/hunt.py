from google.appengine.ext import ndb
from clue import Clue
from party import Party
from Story import Story


class Hunt(ndb.model):
    # id = ndb.IntegerProperty()
    # state = ndb.IntegerProperty(default=1)
    story = ndb.ReferenceProperty(Story,
                                  collection_name="hunts")
    start = ndb.DateTimeProperty(auto_now_add=True)
    hints_used = ndb.IntegerProperty(default=0)
    end = ndb.DateTimeProperty()
    code = ndb.StringProperty()
    max_users = ndb.IntegerProperty(default=-1)
    current_clue = ndb.ReferenceProperty(Clue)
    party = ndb.ReferenceProperty(Party)
