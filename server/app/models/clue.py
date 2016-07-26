from google.appengine.ext import ndb


class Clue(ndb.Model):
    text = ndb.TextProperty(required=True)
    hint = ndb.StringProperty()
    media_url = ndb.StringProperty()
    answers = ndb.StringProperty(repeated=True)
    story_id = ndb.ComputedProperty(lambda s: s.uid.split(':')[0])
    clue_id = ndb.ComputedProperty(lambda s: s.uid.split(':')[1])
    uid = ndb.StringProperty(required=True)

    @staticmethod
    def build_uid(story_id, clue_id):
        return ':'.join([story_id, clue_id])

    @classmethod
    def build_key(cls, story_id, clue_id):
        return ndb.Key(cls, cls.build_uid(story_id, clue_id))
