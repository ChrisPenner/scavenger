from google.appengine.ext import ndb
from hunt import Hunt


class Party(ndb.model):
    # id = ndb.IntegerProperty()
    # state = ndb.IntegerProperty(default=1)
    name = ndb.StringProperty()
    hunts = ndb.ReferenceProperty(Hunt,
                                  collection_name="parties",
                                  repeated=True)
