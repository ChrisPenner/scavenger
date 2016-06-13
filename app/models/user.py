from google.appengine.ext import ndb


class User(ndb.Model):
    group_key = ndb.KeyProperty("Group")
    data = ndb.JsonProperty(default={})
    registration_date = ndb.DateTimeProperty(auto_now_add=True)

    @property
    def group(self):
        return self.group_key.get()

    @group.setter
    def group(self, value):
        self.group_key = ndb.Key("Group", value.id)

    @property
    def phone(self):
        return self.id
