from unittest import TestCase
from google.appengine.ext import testbed, ndb

from app.models.answer import Answer
from app.models.clue import Clue
from app.models.story import Story


class TestClue(TestCase):
    def setUp(self):
        self.testbed = testbed.Testbed()
        self.testbed.activate()
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_memcache_stub()
        ndb.get_context().set_cache_policy(False)
        self.story_uid = 'STORY'
        self.clue_uid = Clue.build_uid(self.story_uid, 'START')
        self.answer_uid = Answer.build_uid(self.story_uid, 'START', 'TRANSITION')
        Story.from_uid(self.story_uid, default_hint='default hint').put()
        Clue.from_uid(self.clue_uid, text='Start the story', hint='clue hint').put()
        Answer.from_uid(
            self.answer_uid,
            pattern=r'my answer is (?P<user_answer>\w+)',
            next_clue=self.clue_uid,
            ).put()

    def test_deleting_clue_deletes_answer(self):
        Clue.build_key(uid=self.clue_uid).delete()
        self.assertIsNone(Answer.get_by_id(self.answer_uid))

    def test_deleting_story_deletes_answer(self):
        Story.build_key(self.story_uid).delete()
        self.assertIsNone(Answer.get_by_id(self.answer_uid))
