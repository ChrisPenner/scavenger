from google.appengine.ext import ndb


class Story(ndb.Model):
    clues = ndb.StringProperty(repeated=True)
    default_hint = ndb.StringProperty(required=True)
    story_id = ndb.StringProperty(required=True)
    uid = ndb.StringProperty(required=True)

    @classmethod
    def from_id(cls, story_id=None, *args, **kwargs):
        story_id = story_id.upper()
        uid = cls.build_uid(story_id)
        key = self.build_key(story_id)
        return Story(key=key, story_id=story_id, uid=uid, *args, **kwargs)

    @staticmethod
    def build_uid(story_id):
        story_id = story_id.upper()
        return story_id

    @classmethod
    def build_key(cls, story_id):
        story_id = story_id.upper()
        return ndb.Key(cls, cls.build_uid(story_id))

    @classmethod
    def get_by_story_id(cls, story_id):
        story_id = story_id.upper()
        return cls.build_key(story_id).get()
