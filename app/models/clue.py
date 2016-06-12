from google.appengine.ext import ndb
from app.models.answer import Answer


class Clue(ndb.Model):
    name = ndb.StringProperty()
    text = ndb.StringProperty()
    next_clue = ndb.KeyProperty("Clue")
    hints = ndb.StringProperty(repeated=True)
    answers = ndb.StructuredProperty(Answer)

    @property
    def first_clue(self):
        return self.clues[0]

    def __str__(self):
        return self.text

    def match_answer(self, message, has_media):
        return next((a for a in self.answers
                    if a.match(self.message, has_media=self.has_media)), None)
