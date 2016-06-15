from google.appengine.ext import ndb


class Story(ndb.Model):
    clues = ndb.JsonProperty(required=True)
    default_hint = ndb.StringProperty(required=True)
