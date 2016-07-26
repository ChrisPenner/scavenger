from google.appengine.ext import ndb


class Clue(ndb.Model):
    text = ndb.TextProperty(required=True)
    hint = ndb.StringProperty()
    media_url = ndb.StringProperty()
    answers = ndb.StringProperty(repeated=True)
    clue_id = ndb.StringProperty(required=True)
    story_id = ndb.StringProperty(required=True)
    uid = ndb.StringProperty(required=True)

    @classmethod
    def from_id(cls, story_id, clue_id, *args, **kwargs):
        key = cls.build_key(story_id, clue_id)
        uid = cls.build_uid(story_id, clue_id)
        return Clue(key=key, story_id=story_id, clue_id=clue_id, uid=uid, *args, **kwargs)

    @staticmethod
    def build_uid(story_id, clue_id):
        return ':'.join([story_id, clue_id])

    @classmethod
    def build_key(cls, story_id, clue_id):
        return ndb.Key(cls, cls.build_uid(story_id, clue_id))

    @classmethod
    def get(cls, story_id, clue_id):
        return self.build_key(story_id, clue_id).get()

