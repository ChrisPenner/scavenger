from google.appengine.ext import ndb
from app.models.user import User


class Group(ndb.Model):
    name = ndb.StringProperty()
    story_key = ndb.KeyProperty("Story")
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    hints_used = ndb.IntegerProperty(default=0)
    completed_at = ndb.DateTimeProperty()
    users = ndb.KeyProperty("User", repeated=True)
    current_clue_key = ndb.StringProperty(required=True)

    def users(self):
        return User.query(User.group == self.key()).fetch()

    @property
    def current_clue(self):
        return self.story.clues[self.current_clue_key]

    @current_clue.setter
    def current_clue(self, value):
        self.current_clue_key = value

    @property
    def story(self):
        return self.story_key.get()

    @story.setter
    def story(self, value):
        self.story_key = ndb.Key("Story", value.id)
