from google.appengine.ext import ndb


class Story(ndb.Model):
    EDITABLE_FIELDS = ['clues', 'default_hint', 'default_end', 'allows_groups']

    clues = ndb.StringProperty(repeated=True)
    default_hint = ndb.StringProperty(required=True)
    default_end = ndb.StringProperty(required=True)
    allows_groups = ndb.BooleanProperty(default=False)
    uid = ndb.StringProperty(required=True)

    @classmethod
    def get_by_id(cls, id):
        if not id:
            return None
        return super(Story, cls).get_by_id(id.upper())

    @classmethod
    def from_uid(cls, uid, *args, **kwargs):
        uid = uid.upper()
        return Story(key=cls.build_key(uid), uid=uid, *args, **kwargs)

    @staticmethod
    def build_uid(story_id):
        story_id = story_id.upper()
        return story_id

    @classmethod
    def build_key(cls, uid):
        uid = uid.upper()
        return ndb.Key(cls, cls.build_uid(uid))

    def add_clue(self, clue_uid):
        if clue_uid not in self.clues:
            self.clues.append(clue_uid)

    def remove_clue(self, clue_uid):
        if clue_uid in self.clues:
            self.clues.remove(clue_uid)

    @classmethod
    def _pre_delete_hook(cls, key):
        story = cls.get_by_id(key.id())
        ndb.delete_multi([ndb.Key('Clue', uid) for uid in story.clues])
