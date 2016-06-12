from google.appengine.ext import ndb


class Hint(ndb.model):
    name = ndb.StringProperty()
    priority = ndb.IntegerProperty(default=5)
    text = ndb.StringProperty()

    def __str__(self):
        return self.text
