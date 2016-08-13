from google.appengine.ext import ndb


class Story(ndb.Model):
    DATA_FIELDS = ['clues', 'default_hint']

    clues = ndb.StringProperty(repeated=True)
    default_hint = ndb.StringProperty(required=True)
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
    def build_key(cls, story_id):
        story_id = story_id.upper()
        return ndb.Key(cls, cls.build_uid(story_id))

    def add_clue(self, clue):
        if clue.uid not in self.clues:
            self.clues.append(clue.uid)

    def remove_clue(self, clue):
        if clue.uid in self.clues:
            self.clues.remove(clue.uid)
