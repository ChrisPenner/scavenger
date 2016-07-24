from google.appengine.ext import ndb


class Story(ndb.Model):
    clues = ndb.StringProperty(repeated=True)
    default_hint = ndb.StringProperty(required=True)
    story_id = ndb.StringProperty(required=True)

    def __init__(self, story_id=None, *args, **kwargs):
        story_id = story_id.upper()
        key = self.build_key(story_id)
        super(Story, self).__init__(key=key, story_id=story_id, *args, **kwargs)

    @staticmethod
    def build_id(story_id):
        story_id = story_id.upper()
        return story_id

    @classmethod
    def build_key(cls, story_id):
        story_id = story_id.upper()
        return ndb.Key(cls, cls.build_id(story_id))

    @classmethod
    def get_by_story_id(cls, story_id):
        story_id = story_id.upper()
        return cls.build_key(story_id).get()
