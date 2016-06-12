from google.appengine.ext import ndb


class Answer(ndb.Model):
    name = ndb.StringProperty()
    text = ndb.StringProperty()
    type = ndb.StringProperty()
    clue = ndb.KeyProperty("User")
    story = ndb.KeyProperty("Story")

    def match(self, message, has_media):
        return self.type == 'media' and has_media or self.pattern.match(message)

    def __str__(self):
        return self.text
