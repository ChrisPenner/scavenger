from google.appengine.ext import ndb
from group import Group


class User(ndb.model):
    # id = ndb.IntegerProperty()
    # state = ndb.IntegerProperty(default=1)
    name = ndb.StringProperty()
    email = ndb.StringProperty()
    phone = ndb.StringProperty()
    group = ndb.KeyProperty(Group)
    registration_date = ndb.DateTimeProperty(auto_now_add=True)
