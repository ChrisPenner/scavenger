from google.appengine.ext import ndb


class Answer(ndb.Model):
    pattern = ndb.StringProperty(required=True)
    next_clue = ndb.StringProperty(required=True)
    answer_id = ndb.StringProperty(required=True)
    clue_id = ndb.StringProperty(required=True)
    story_id = ndb.StringProperty(required=True)

    @classmethod
    def from_ids(cls, story_id, clue_id, answer_id):
        key = cls.build_key(story_id, clue_id, answer_id)
        return cls(key=key, story_id=story_id, clue_id=clue_id, answer_id=answer_id)

    @staticmethod
    def build_id(story_id, clue_id, answer_id):
        return ':'.join([story_id, clue_id, answer_id])

    @classmethod
    def build_key(cls, story_id, clue_id, answer_id):
        return ndb.Key(cls, cls.build_id(story_id, clue_id, answer_id))

    @classmethod
    def get_by_ids(cls, story_id, clue_id, answer_id):
        return cls.build_key(story_id, clue_id, answer_id).get()
