from unittest import TestCase
from webapp2 import Request
from mock import Mock, patch

from google.appengine.ext import testbed, ndb

from app.main import app

from app.messages import HOW_TO_START, STORY_NOT_FOUND, NO_GROUP_FOUND, \
    ALREADY_IN_GROUP, JOINED_GROUP, RESTARTED, END_OF_STORY, start_new_story
from app.scavenger import CLUE, HINT, START_STORY, JOIN_GROUP, RESTART, ANSWER

from app.scavenger import twiml_response, format_response, determine_message_type, perform_action, \
    split_data, get_next_clue, answer


class TestScavenger(TestCase):
    def setUp(self):
        self.request = Request.blank('/api/message')
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


class TestSplitData(TestCase):
    def test_splits_data(self):
        user_data = {
            'user_key': 'user stuff',
            'user_more': 'more user stuff',
        }
        group_data = {
            'group_key': 'group stuff',
            'group_more': 'more group stuff',
        }
        combined = {}
        combined.update(user_data)
        combined.update(group_data)
        user_result, group_result = split_data(combined)
        self.assertEqual(user_data, user_result)
        self.assertEqual(group_data, group_result)


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

    def test_sends_media_urls_from_clues(self):
        messages = ['HELLO!!', {'text': 'my_clue', 'media_url': 'picture.com/my.png'},
                    {'text': 'my_other_clue', 'media_url': 'second.com/my.jpg'}]
        response = twiml_response(self.user, START_STORY, messages)
        self.assertIn('<Media>picture.com/my.png</Media>', response)
        self.assertIn('<Media>second.com/my.jpg</Media>', response)

    def test_extracts_text_from_clues(self):
        messages = ['HELLO!!', {'text': 'my_clue'}, {'text': 'my_other_clue'}]
        response = twiml_response(self.user, START_STORY, messages)
        self.assertIn('my_clue', response)
        self.assertIn('my_other_clue', response)


class TestFormatResponse(TestCase):
    def test_formats_user_data(self):
        data = {'user_name': 'bob', 'user_color': 'red'}
        user = Mock()
        user.data = data
        user.group.data = {}
        message = {'text': 'Hello {user_name}, you like {user_color}?'}
        response = format_response(message, user)
        self.assertEqual({'text': 'Hello bob, you like red?'}, response)

    def test_formats_group_data(self):
        data = {'group_name': 'bob', 'group_color': 'red'}
        user = Mock()
        user.data = {}
        user.group.data = data
        message = {'text': 'Hello {group_name}, you like {group_color}?'}
        response = format_response(message, user)
        self.assertEqual({'text': 'Hello bob, you like red?'}, response)


class TestDetermineMessageType(TestCase):
    def test_returns_proper_type(self):
        self.assertEqual(START_STORY, determine_message_type('STart something'))
        self.assertEqual(JOIN_GROUP, determine_message_type('joiN something'))
        self.assertEqual(RESTART, determine_message_type('restART'))
        self.assertEqual(ANSWER, determine_message_type('This is my Answer'))


class TestPerformAction(TestCase):
    def test_returns_expected_how_to_start(self):
        user = Mock(group=None)
        result = perform_action(ANSWER, 'blah', user)
        self.assertEqual([HOW_TO_START], result)

    @patch('app.scavenger.Story')
    def test_returns_expected_story_not_found(self, story_mock):
        story_mock.get_by_id.return_value = None
        user = Mock(group=None)
        result = perform_action(START_STORY, 'start blah', user)
        self.assertEqual([STORY_NOT_FOUND], result)

    @patch('app.scavenger.Group')
    @patch('app.scavenger.Story')
    def test_returns_expected_starting_new_story(self, story_mock, group_mock):
        clue = {'text': 'test'}
        group_mock.return_value.current_clue = clue
        group_mock.gen_code.return_value = 'abcd'
        user = Mock(group=None)
        result = perform_action(START_STORY, 'start blah', user)
        self.assertEqual([start_new_story('abcd'), clue], result)

    @patch('app.scavenger.Group')
    def test_returns_expected_group_not_found(self, group_mock):
        group_mock.get_by_id.return_value = None
        user = Mock(group=None)
        result = perform_action(JOIN_GROUP, 'join blah', user)
        self.assertEqual([NO_GROUP_FOUND], result)

    @patch('app.scavenger.Group')
    def test_returns_expected_already_in_group(self, group_mock):
        user = Mock(group_code='code')
        result = perform_action(JOIN_GROUP, 'join code', user)
        self.assertEqual([ALREADY_IN_GROUP], result)

    @patch('app.scavenger.Group')
    def test_returns_expected_joined_group(self, group_mock):
        clue = {'text': 'clue'}
        group_mock.current_clue = clue
        group_mock.get_by_id.return_value = group_mock
        user = Mock()
        result = perform_action(JOIN_GROUP, 'join code', user)
        self.assertEqual([JOINED_GROUP, clue], result)

    def test_returns_expected_restarted(self):
        user = Mock()
        clue = {'text': 'clue'}
        user.group.current_clue = clue
        result = perform_action(RESTART, 'restart', user)
        self.assertEqual([RESTARTED, clue], result)

    def test_returns_expected_end_of_story(self):
        user = Mock()
        user.group.current_clue = None
        result = perform_action(ANSWER, 'asdf', user)
        self.assertEqual([END_OF_STORY], result)


class TestGetNextClue(TestCase):
    def test_answers_clue_properly(self):
        user = Mock()
        user.group.current_clue = {
            'text': 'hi',
            'answers': [
                [r'\w+\s+(?P<second_word>\w+)', "two-words"],
                [r'steve', "steve"],
                [r'.*', "catch-all"],
            ],
        }
        message = 'test answer'
        next_clue, answer_data = get_next_clue(message, user)
        self.assertEqual('two-words', next_clue)
        self.assertEqual({'second_word': 'answer'}, answer_data)


class TestAnswerClue(TestCase):
    def test_sets_next_clue_on_group(self):
        user = Mock()
        user.group.current_clue = {
            'text': 'hi',
            'answers': [
                [r'\w+\s+(?P<group_word>\w+)', "two-words"],
                [r'steve', "steve"],
                [r'.*', "catch-all"],
            ],
        }
        user.group.data = {}
        message = 'test answer'
        responses = answer(message, user)
        self.assertEqual(['two-words'], responses)
        self.assertEqual("two-words", user.group.current_clue)
        self.assertEqual({'group_word': 'answer'}, user.group.data)

    def test_gives_hints_if_incorrect(self):
        hint = {'text': 'My hint'},
        user = Mock()
        user.group.current_clue = {
            'text': 'hi',
            'hint': hint,
            'answers': [
                [r'blah', "blah"],
            ],
        }
        message = 'test answer'
        responses = answer(message, user)
        self.assertEqual([hint], responses)
