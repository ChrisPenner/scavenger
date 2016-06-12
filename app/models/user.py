from google.appengine.ext import ndb


class User(ndb.Model):
    name = ndb.StringProperty()
    email = ndb.StringProperty()
    phone = ndb.StringProperty()
    group = ndb.KeyProperty("Group")
    registration_date = ndb.DateTimeProperty(auto_now_add=True)
