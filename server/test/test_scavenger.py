from unittest import TestCase
from webapp2 import Request
from mock import Mock, patch, MagicMock

from google.appengine.ext import testbed, ndb

from app.main import app
from app.models.clue import Clue
from app.models.answer import Answer
from app.models.group import Group

from app.messages import HOW_TO_START, STORY_NOT_FOUND, NO_GROUP_FOUND, \
    ALREADY_IN_GROUP, JOINED_GROUP, RESTARTED, END_OF_STORY, start_new_story
from app.scavenger import CLUE, HINT, START_STORY, JOIN_GROUP, RESTART, ANSWER, Result

from app.scavenger import twiml_response, format_message, determine_message_type, perform_action, \
    split_data, get_next_clue, answer
from models.message import Message
from models.user import User


class AppengineTest(TestCase):
    def setUp(self):
        self.testbed = testbed.Testbed()
        self.testbed.activate()
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_memcache_stub()
        ndb.get_context().set_cache_policy(False)

    def tearDown(self):
        self.testbed.deactivate()

class TestScavenger(TestCase):
    def setUp(self):
        self.request = Request.blank('/api/message')
        self.request.method = 'POST'
        self.request.POST.update({
            'From': '+5555551234',
            'Body': 'texty text'
        })

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
        messages = [Clue(text='Hey there!')]
        response = twiml_response(self.user, START_STORY, messages)
        for m in messages:
            self.assertIn(m.text, response)

    def test_sends_copies_to_each_recipient_for_CLUE_or_HINT(self):
        phones = ['+1234', '+555', '+678']
        self.user.group.users = phones
        messages = [Clue(text='Hey there!')]
        response = twiml_response(self.user, CLUE, messages)
        for p in phones:
            self.assertIn(p, response)
        response = twiml_response(self.user, HINT, messages)
        for p in phones:
            self.assertIn(p, response)

    def test_sends_media_urls_from_clues(self):
        messages = [Clue(text='my_clue', media_url='picture.com/my.png'),
                    Clue(text='my_other_clue', media_url='second.com/my.jpg')]
        response = twiml_response(self.user, START_STORY, messages)
        self.assertIn('<Media>picture.com/my.png</Media>', response)
        self.assertIn('<Media>second.com/my.jpg</Media>', response)

    def test_extracts_text_from_clues(self):
        messages = [Clue(text='my_clue'), Clue(text='my_other_clue')]
        response = twiml_response(self.user, START_STORY, messages)
        self.assertIn('my_clue', response)
        self.assertIn('my_other_clue', response)


class TestFormatResponse(TestCase):
    def test_formats_user_data(self):
        data = {'user_name': 'bob', 'user_color': 'red'}
        user = Mock()
        user.data = data
        message = Clue(text='Hello {user_name}, you like {user_color}?')
        response = format_message(message, user, Group(data={}))
        self.assertEqual('Hello bob, you like red?', response.text)

    def test_formats_group_data(self):
        data = {'group_name': 'bob', 'group_color': 'red'}
        user = Mock()
        user.data = {}
        message = Clue(text='Hello {group_name}, you like {group_color}?')
        response = format_message(message, user, Group(data=data))
        self.assertEqual('Hello bob, you like red?', response.text)


class TestDetermineMessageType(TestCase):
    def test_returns_proper_type(self):
        self.assertEqual(START_STORY, determine_message_type('STart something'))
        self.assertEqual(JOIN_GROUP, determine_message_type('joiN something'))
        self.assertEqual(RESTART, determine_message_type('restART'))
        self.assertEqual(ANSWER, determine_message_type('This is my Answer'))


class TestPerformAction(TestCase):
    def test_returns_expected_how_to_start(self):
        user = User()
        result = perform_action(ANSWER, 'blah', user, None)
        self.assertEqual([HOW_TO_START.text], [m.text for m in result.messages])

    @patch('app.scavenger.Clue.get_by_id', new=Mock(return_value=None))
    def test_returns_expected_story_not_found(self):
        user = Mock()
        result = perform_action(START_STORY, 'start blah', user, None)
        self.assertEqual([STORY_NOT_FOUND], result)

    @patch('app.scavenger.Group')
    @patch('app.scavenger.Clue')
    def test_returns_expected_starting_new_story(self, clue_mock, group_mock):
        clue_mock.get_by_id.return_value = Clue(text='test')
        clue = Clue(text='test')
        group_mock.return_value.current_clue = clue
        group_mock.gen_uid.return_value = 'abcd'
        user = User()
        result = perform_action(START_STORY, 'start blah', user, None)
        expected_message_text = [start_new_story('abcd').text, clue.text]
        self.assertEqual(expected_message_text, [m.text for m in result.messages])

    @patch('app.scavenger.Group')
    def test_returns_expected_group_not_found(self, group_mock):
        group_mock.get_by_id.return_value = None
        user = Mock()
        result = perform_action(JOIN_GROUP, 'join blah', user, None)
        self.assertEqual([NO_GROUP_FOUND], result)

    @patch('app.scavenger.Group', new=Mock())
    def test_returns_expected_already_in_group(self):
        user = User(group_uid='code')
        result = perform_action(JOIN_GROUP, 'join code', user, Group())
        self.assertEqual([ALREADY_IN_GROUP], result)

    @patch('app.scavenger.Group')
    @patch('app.scavenger.Clue')
    def test_returns_expected_joined_group(self, clue_mock, group_mock):
        clue_mock.get_by_id.return_value = Clue(text='clue text')
        group = Group(uid='code', clue_uid='MYSTORY:MYCLUE')
        group_mock.get_by_id.return_value = group
        user = User()
        result = perform_action(JOIN_GROUP, 'join code', user, None)
        self.assertEqual([JOINED_GROUP.text, 'clue text'], [m.text for m in result.messages])

    @patch('app.scavenger.Clue')
    def test_returns_expected_restarted(self, clue_mock):
        start_message = 'Start the story'
        clue_mock.get_by_id.return_value = Clue(text=start_message)
        user = Mock()
        result = perform_action(RESTART, 'restart', user, Group(clue_uid='something'))
        self.assertEqual([RESTARTED.text, start_message], [m.text for m in result.messages])

    @patch('app.scavenger.Clue')
    def test_returns_expected_end_of_story(self, clue_mock):
        clue_mock.get_by_id.return_value = Clue(text='blah', answer_uids=[])
        user = Mock()
        result = perform_action(ANSWER, 'asdf', user, Group())
        self.assertEqual([END_OF_STORY.text], [m.text for m in result.messages])


class TestGetNextClue(TestCase):
    @patch('app.scavenger.ndb.get_multi')
    def test_answers_clue_properly(self, get_multi_mock):
        answers = [
            Answer(pattern=r'\w+\s+(?P<second_word>\w+)', next_clue='TWOWORDS'),
            Answer(pattern=r'steve', next_clue="STEVE"),
            Answer(pattern=r'.*', next_clue='CATCHALL'),
        ]
        get_multi_mock.return_value = answers
        message = 'test answer'
        next_clue, answer_data = get_next_clue(message, answers)
        self.assertEqual('TWOWORDS', next_clue)
        self.assertEqual({'second_word': 'answer'}, answer_data)


class TestAnswerClue(TestCase):

    @patch('app.scavenger.Clue')
    @patch('app.scavenger.ndb.get_multi')
    def test_sets_next_clue_on_group(self, get_answers_mock, clue_mock):
        clue_mock.get_by_id.return_value = Mock(is_endpoint=False)
        user = MagicMock()
        get_answers_mock.return_value = [
            Answer(
                pattern=r'\w+\s+(?P<group_word>\w+)',
                next_clue=r'STORY:TWO-WORDS',
            ),
            Answer(
                pattern=r'.*',
                next_clue=r'STORY:GENERIC'
            )
        ]
        message = 'test answer'
        result = answer(message, user, Group(data={}))
        self.assertEqual("STORY:TWO-WORDS", result.group.clue_uid)
        self.assertEqual({'group_word': 'answer'}, result.group.data)

    @patch('app.scavenger.Clue')
    @patch('app.scavenger.ndb.get_multi')
    def test_gives_hints_if_incorrect(self, get_answers_mock, clue_mock):
        clue_mock.get_by_id.return_value = Mock(hint='My Hint', is_endpoint=False)
        get_answers_mock.return_value = [Answer(pattern=r'tough answer', next_clue='SOME:NEXTCLUE')]
        user = MagicMock()
        message = 'this is not the correct answer'
        result = answer(message, user, Group())
        self.assertEqual(['My Hint'], [r.text for r in result.messages])
