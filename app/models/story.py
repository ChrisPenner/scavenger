from google.appengine.ext import ndb


class Story(ndb.Model):
    name = ndb.StringProperty(required=True)
    clues = ndb.JsonProperty(required=True)
    default_hint = ndb.JsonProperty(required=True)
