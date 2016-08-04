from google.appengine.ext import ndb
from app.models.story import Story


class Clue(ndb.Model):
    DATA_FIELDS = ['text', 'hint', 'media_url']

    text = ndb.TextProperty(required=True)
    hint = ndb.StringProperty()
    media_url = ndb.StringProperty()
    answers = ndb.StringProperty(repeated=True)
    story_id = ndb.ComputedProperty(lambda s: s.uid.split(':')[0])
    clue_id = ndb.ComputedProperty(lambda s: s.uid.split(':')[1])
    uid = ndb.StringProperty(required=True)

    @classmethod
    def from_uid(cls, uid, *args, **kwargs):
        key = cls.build_key(uid=uid)
        return cls(key=key, uid=uid.upper(), *args, **kwargs)

    @staticmethod
    def build_uid(story_id, clue_id):
        return ':'.join([story_id.upper(), clue_id.upper()])

    @classmethod
    def build_key(cls, story_id=None, clue_id=None, uid=None):
        if uid:
            return ndb.Key(cls, uid)
        elif story_id and clue_id:
            return ndb.Key(cls, cls.build_uid(story_id, clue_id))
        raise TypeError('build_key requires either story_id and clue_id or a uid')

    @classmethod
    def get_by_ids(cls, story_id, clue_id):
        return cls.build_key(story_id=story_id, clue_id=clue_id).get()

    def _pre_put_hook(self):
        story = Story.get_by_id(self.story_id)
        if story is None:
            raise ValueError("A story doesn't exist for this clue")
        story.add_clue(self)
        story.put()

    def _pre_delete_hook(self):
        story = Story.get_by_id(self.story_id)
        if story is None:
            return

        story.remove_clue(self)
        story.put()

    def add_answer(self, answer):
        if answer.uid not in self.answers:
            self.answers.append(answer.uid)

    def remove_answer(self, answer):
        if answer.uid in self.answers:
            self.answers.remove(answer.uid)
