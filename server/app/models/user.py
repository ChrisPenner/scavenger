from google.appengine.ext import ndb
from app.models.group import Group


class User(ndb.Model):
    group_uid = ndb.StringProperty()
    data = ndb.JsonProperty(default={})
    registration_date = ndb.DateTimeProperty(auto_now_add=True)

    @property
    def group(self):
        if not self.__dict__.get('group_entity'):
            self.__dict__['group_entity'] = Group.get_by_id(self.group_uid)
        return self.__dict__['group_entity']

    @group.setter
    def group(self, group):
        self.group_uid = group.uid
        self.__dict__['group_entity'] = group

    @property
    def phone(self):
        return self.key.id()
