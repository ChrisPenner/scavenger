from google.appengine.ext import ndb


class User(ndb.Model):
    group_code = ndb.StringProperty()
    data = ndb.JsonProperty(default={})
    registration_date = ndb.DateTimeProperty(auto_now_add=True)

    @property
    def group(self):
        if self.__dict__.get('group'):
            return self.__dict__.get('group')
        if not self.group_code:
            return None
        self.__dict__['group'] = ndb.Key('Group', self.group_code).get()
        return self.__dict__['group']

    @group.setter
    def group(self, value):
        self.group_code = value.key.id()
        self.__dict__['group'] = value

    @property
    def phone(self):
        return self.key.id()
