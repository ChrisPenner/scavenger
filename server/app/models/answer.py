from google.appengine.ext import ndb


class Answer(ndb.Model):
    DATA_FIELDS = ['pattern', 'next_clue']

    pattern = ndb.StringProperty(required=True)
    next_clue = ndb.StringProperty(required=True)
    story_id = ndb.ComputedProperty(lambda s: ':'.join(s.uid.split(':')[:1]))
    clue_id = ndb.ComputedProperty(lambda s: ':'.join(s.uid.split(':')[:2]))
    answer_id = ndb.ComputedProperty(lambda s: ':'.join(s.uid.split(':')[:3]))
    uid = ndb.StringProperty(required=True)

    @classmethod
    def from_id(cls, uid):
        key = cls.build_key(uid)
        return cls(key=key, uid=uid.upper())

    @staticmethod
    def build_uid(story_id, clue_id, answer_id):
        return ':'.join([story_id, clue_id, answer_id]).upper()

    @classmethod
    def build_key(cls, uid):
        return ndb.Key(cls, uid.upper())

    @classmethod
    def get_by_ids(cls, story_id, clue_id, answer_id):
        return cls.build_key(cls.build_uid(story_id, clue_id, answer_id)).get()
