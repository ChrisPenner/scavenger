from unittest import TestCase
from webapp2 import Request
from mock import Mock

from google.appengine.ext import testbed, ndb

from app.main import app

from app.models.user import User
from app.messages import HOW_TO_START, STORY_NOT_FOUND, STARTING_NEW_STORY, NO_GROUP_FOUND, \
                     ALREADY_IN_GROUP, JOINED_GROUP, RESTARTED, END_OF_STORY
from app.scavenger import CLUE, HINT, START_STORY, JOIN_GROUP, RESTART, ANSWER

from app.scavenger import twiml_response, format_response, determine_message_type


class TestScavenger(TestCase):
    def setUp(self):
        self.request = Request.blank('/')
        self.request.method = 'POST'
        self.request.POST.update({
            'From': '+5555551234',
            'Body': 'texty text'
        })
        self.testbed = testbed.Testbed()
        self.testbed.activate()
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_memcache_stub()
        ndb.get_context().set_cache_policy(False)

    def tearDown(self):
        self.testbed.deactivate()

    def test_post_requires_body(self):
        del self.request.POST['Body']
        response = self.request.get_response(app)
        self.assertEqual(400, response.status_int)

    def test_post_requires_from_phone(self):
        del self.request.POST['From']
        response = self.request.get_response(app)
        self.assertEqual(400, response.status_int)

class TestTwimlResponse(TestCase):
    def setUp(self):
        self.user = Mock(phone='+1111')

    def test_includes_messages_in_response(self):
        messages = ['HELLO!!', 'Hey there!']
        response = twiml_response(self.user, START_STORY, messages)
        for m in messages:
            self.assertIn(m, response)

    def test_sends_copies_to_each_recipient_for_CLUE_or_HINT(self):
        phones = ['+1234', '+555', '+678']
        self.user.group.users = phones
        messages = ['HELLO!!', 'Hey there!']
        response = twiml_response(self.user, CLUE, messages)
        for p in phones:
            self.assertIn(p, response)
        response = twiml_response(self.user, HINT, messages)
        for p in phones:
            self.assertIn(p, response)


class TestFormatData(TestCase):
    def test_formats_user_data(self):
        data = {'user_name': 'bob', 'user_color': 'red'}
        user = Mock()
        user.data = data
        user.group.data = {}
        message = 'Hello {user_name}, you like {user_color}?'
        response = format_response(message, user)
        self.assertEqual(message.format(**data), response)

    def test_formats_group_data(self):
        data = {'group_name': 'bob', 'group_color': 'red'}
        user = Mock()
        user.data = {}
        user.group.data = data
        message = 'Hello {group_name}, you like {group_color}?'
        response = format_response(message, user)
        self.assertEqual(message.format(**data), response)


class TestDetermineMessageType(TestCase):
    def test_returns_proper_type(self):
        self.assertEqual(START_STORY, determine_message_type('STart something'))
        self.assertEqual(JOIN_GROUP, determine_message_type('joiN something'))
        self.assertEqual(RESTART, determine_message_type('restART'))
        self.assertEqual(ANSWER, determine_message_type('This is my Answer'))
