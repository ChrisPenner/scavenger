from google.appengine.ext import ndb


class User(ndb.Model):
    group_code = ndb.StringProperty()
    data = ndb.JsonProperty(default={})
    registration_date = ndb.DateTimeProperty(auto_now_add=True)

    @property
    def group(self):
        if not self.group_code:
            return None
        return ndb.Key('Group', self.group_code).get()

    @group.setter
    def group(self, value):
        self.group_code = value.key.id()

    @property
    def phone(self):
        return self.key.id()
