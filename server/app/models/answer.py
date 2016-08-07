from google.appengine.ext import ndb
from app.models.clue import Clue

from .validators import not_empty


class Answer(ndb.Model):
    DATA_FIELDS = ['pattern', 'next_clue']

    pattern = ndb.StringProperty(required=True, validator=not_empty)
    next_clue = ndb.StringProperty(required=True)
    story_uid = ndb.ComputedProperty(lambda s: s.uid.split(':')[0])
    clue_uid = ndb.ComputedProperty(lambda s: ':'.join(s.uid.split(':')[:2]))
    uid = ndb.StringProperty(required=True)

    @classmethod
    def from_uid(cls, uid):
        key = cls.build_key(uid)
        return cls(key=key, uid=uid.upper())

    @classmethod
    def get_by_id(cls, id):
        return super(Answer, cls).get_by_id(id.upper())

    @staticmethod
    def build_uid(story_id, clue_id, answer_id):
        return ':'.join([story_id, clue_id, answer_id]).upper()

    @classmethod
    def build_key(cls, uid):
        return ndb.Key(cls, uid.upper())

    def _pre_put_hook(self):
        clue = Clue.get_by_id(self.clue_uid)
        if clue is None:
            raise ValueError("A clue doesn't exist for this clue")
        clue.add_answer(self)
        clue.put()

    def _pre_delete_hook(self):
        clue = Clue.get_by_id(self.clue_uid)
        if clue is None:
            return

        clue.remove_answer(self)
        clue.put()

