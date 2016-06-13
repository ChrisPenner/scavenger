from unittest import TestCase
from webapp2 import Request

from google.appengine.ext import testbed, ndb

from app.main import app


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

    def test_prompts_for_signup_when_no_user(self):
        response = self.request.get_response(app)
        self.assertEqual(200, response.status_int)
        self.assertIn("don't recognize", response.body)
