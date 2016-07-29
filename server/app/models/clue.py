from google.appengine.ext import ndb


class Clue(ndb.Model):
    DATA_FIELDS = ['text', 'hint', 'media_url']

    text = ndb.TextProperty(required=True)
    hint = ndb.StringProperty()
    media_url = ndb.StringProperty()
    answers = ndb.StringProperty(repeated=True)
    story_id = ndb.ComputedProperty(lambda s: ':'.join(s.uid.split(':')[:1]))
    clue_id = ndb.ComputedProperty(lambda s: ':'.join(s.uid.split(':')[:2]))
    uid = ndb.StringProperty(required=True)

    @classmethod
    def from_id(cls, uid, *args, **kwargs):
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
