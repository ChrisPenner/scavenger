from google.appengine.ext import ndb


class User(ndb.Model):
    group_uid = ndb.StringProperty()
    data = ndb.JsonProperty(default={})
    registration_date = ndb.DateTimeProperty(auto_now_add=True)

    @property
    def group(self):
        Group.get_by_id(self.group_uid)

    @group.setter
    def group(self, group):
        if isinstance(group, basestring):
            self.group_uid = group
        else:
            self.group_uid = group.uid

    @property
    def phone(self):
        return self.key.id()
