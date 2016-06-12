from google.appengine.ext import ndb


class Hint(ndb.Model):
    name = ndb.StringProperty()
    priority = ndb.IntegerProperty(default=5)
    text = ndb.StringProperty()

    def __str__(self):
        return self.text


class Story(ndb.Model):
    name = ndb.StringProperty()
    description = ndb.StringProperty()
    first_clue = ndb.KeyProperty("Clue")
    default_hint = ndb.KeyProperty("Hint")
    end_message = ndb.StringProperty()
    code = ndb.StringProperty()
    max_users = ndb.IntegerProperty()
    type = ndb.StringProperty()


class Group(ndb.Model):
    name = ndb.StringProperty()
    story = ndb.KeyProperty("Story")
    created_at = ndb.DateTimeProperty(auto_now_add=True)
    hints_used = ndb.IntegerProperty(default=0)
    completed_at = ndb.DateTimeProperty()
    current_clue = ndb.KeyProperty("Clue")
    users = ndb.KeyProperty("User", repeated=True)

    def __init__(self, story):
        self.current_clue = story.first_clue
        self.story = story.key()

    def users(self):
        return User.query(User.group == self.key()).fetch()


class User(ndb.Model):
    name = ndb.StringProperty()
    email = ndb.StringProperty()
    phone = ndb.StringProperty()
    group = ndb.KeyProperty("Group")
    registration_date = ndb.DateTimeProperty(auto_now_add=True)


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


class Clue(ndb.Model):
    name = ndb.StringProperty()
    text = ndb.StringProperty()
    next_clue = ndb.KeyProperty("Clue")
    hints = ndb.StructuredProperty(Hint)
    answers = ndb.StructuredProperty(Answer)

    @property
    def first_clue(self):
        return self.clues[0]

    def __str__(self):
        return self.text

    def match_answer(self, message, has_media):
        return next((a for a in self.answers
                    if a.match(self.message, has_media=self.has_media)), None)
