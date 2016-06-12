from google.appengine.ext import ndb
from party import Party


class User(ndb.model):
    # id = ndb.IntegerProperty()
    # state = ndb.IntegerProperty(default=1)
    name = ndb.StringProperty()
    email = ndb.StringProperty()
    phone = ndb.StringProperty()
    parties = ndb.KeyProperty(Party,
                                    repeated=True)
    registration_date = ndb.DateTimeProperty(auto_now_add=True)
