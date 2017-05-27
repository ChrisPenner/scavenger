# REST UP

Generates REST-ful routes for projects using webapp2 with Python ndb, it's pretty specific and opinionated, but
that also allows it to do a lot for you.

## Installation

Just copy-paste the .py file into your lib/ folder.

## Usage

```python
# routes.py
from rest_up import ResourceRoutes
from models.user import User
ROUTES = [
    ResourceRoutes('/users', User, id_key='user_id')
    ResourceRoutes('/city/<city_name:[^/]+>/users', User, method='by_city', id_key='user_id')
]
```

```python
# models/user.py
from google.appengine.ext import ndb
from rest_up import serialize_datetime

class User(ndb.Model):
    SERIALIZERS = [serialize_datetime]
    EDITABLE_FIELDS = ['name', 'city']
    VISIBLE_FIELDS = ['name', 'city', 'created']
    user_id = ndb.StringProperty()
    name = ndb.StringProperty()
    city = ndb.StringProperty()
    created = ndb.DateTimeProperty(auto_now_add=True)

    @classmethod
    def by_city(cls, city_name):
        return cls.query(cls.city == city_name).fetch()
```

You'll now have a restful route set up for your users, it supports an 'index' operation (if no id is specified), or
GET, PUT, DELETE for users with an id (e.g. `/users/12345`).

There are a few things you can set for each model:
- EDITABLE_FIELDS: this determines what may be set via a PUT action.
- VISIBLE_FIELDS: this determines what is serialized and sent via GET or INDEX.
- SERIALIZERS: This is a list of serializers that will be tried for unknown datatypes. These will be passed to
    json.dumps, so you can read the docs there for more info.
