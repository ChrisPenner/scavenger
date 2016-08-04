from google.appengine.ext import ndb
from app.models.clue import Clue


class Answer(ndb.Model):
    DATA_FIELDS = ['pattern', 'next_clue']

    pattern = ndb.StringProperty(required=True)
    next_clue = ndb.StringProperty(required=True)
    story_id = ndb.ComputedProperty(lambda s: s.uid.split(':')[0])
    clue_id = ndb.ComputedProperty(lambda s: s.uid.split(':')[1])
    answer_id = ndb.ComputedProperty(lambda s: s.uid.split(':')[2])
    uid = ndb.StringProperty(required=True)

    @classmethod
    def from_uid(cls, uid):
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
        return cls.build_key(story_id=story_id, clue_id=clue_id, answer_id=answer_id).get()

    def _pre_put_hook(self):
        print 'ASDLJFASLKDJFL'
        clue = Clue.get_by_ids(self.story_id, self.clue_id)
        if clue is None:
            raise ValueError("A clue doesn't exist for this clue")
        clue.add_answer(self)
        clue.put()

    def _pre_delete_hook(self):
        clue = Clue.get_by_id(self.clue_id)
        if clue is None:
            return

        clue.remove_answer(self)
        clue.put()

