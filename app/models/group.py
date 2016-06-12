from google.appengine.ext import ndb
# from user import User
from clue import Clue
from story import Story


class Group(ndb.Model):
    name = ndb.StringProperty()
    story = ndb.KeyProperty(Story)
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    hints_used = ndb.IntegerProperty(default=0)
    completed_at = ndb.DateTimeProperty()
    current_clue = ndb.KeyProperty(Clue)
    # users = ndb.KeyProperty(User, repeated=True)

    def __init__(self, story):
        self.current_clue = story.first_clue
        self.story = story.key()

    # def users(self):
    #     return User.query(User.group == self.key()).fetch()
