from google.appengine.ext import ndb


class Clue(ndb.Model):
    text = ndb.TextProperty(required=True)
    hint = ndb.StringProperty()
    media_url = ndb.StringProperty()
    answers = ndb.StringProperty(repeated=True)
    clue_id = ndb.StringProperty(required=True)
    story_id = ndb.StringProperty(required=True)

    def __init__(self, story_id=None, clue_id=None, *args, **kwargs):
        key = self.build_key(story_id, clue_id)
        super(Clue, self).__init__(key=key, story_id=story_id, clue_id=clue_id, *args, **kwargs)

    @staticmethod
    def build_id(story_id, clue_id):
        return ':'.join([story_id, clue_id])

    @classmethod
    def build_key(cls, story_id, clue_id):
        return ndb.Key(cls, cls.build_id(story_id, clue_id))

    @classmethod
    def get(cls, story_id, clue_id):
        return self.build_key(story_id, clue_id).get()

