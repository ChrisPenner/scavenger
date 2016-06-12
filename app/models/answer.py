from google.appengine.ext import ndb
from clue import Clue
from story import Story


class Answer(ndb.model):
    name = ndb.StringProperty()
    text = ndb.StringProperty()
    clue = ndb.KeyProperty(Clue)
    story = ndb.KeyProperty(Story)

    def match(self, message, has_media):
        return self.type == media and has_media or self.pattern.match(message)

    def __str__(self):
        return self.text
