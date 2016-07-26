from google.appengine.ext import ndb


class Story(ndb.Model):
    clues = ndb.StringProperty(repeated=True)
    default_hint = ndb.StringProperty(required=True)
    story_id = ndb.ComputedProperty(lambda s: s.uid)
    uid = ndb.StringProperty(required=True)

    @classmethod
    def from_uid(cls, uid, *args, **kwargs):
        return Story(key=cls.build_key(uid), uid=uid, *args, **kwargs)

    @staticmethod
    def build_uid(story_id):
        story_id = story_id.upper()
        return story_id

    @classmethod
    def build_key(cls, story_id):
        story_id = story_id.upper()
        return ndb.Key(cls, cls.build_uid(story_id))
