from google.appengine.ext import ndb
from story import Story


class Clue(ndb.model):
    name = ndb.StringProperty()
    value = ndb.StringProperty()
    story = ndb.KeyProperty(Story)

    @property
    def first_clue(self):
        return self.clues[0]

