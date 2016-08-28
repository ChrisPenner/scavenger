from unittest import TestCase
from webapp2 import Request

from app.models.message import Message
from mock import Mock, patch, MagicMock

from google.appengine.ext import testbed, ndb

from app.main import app
from app.models.clue import Clue
from app.models.answer import Answer
from app.models.group import Group

from app.messages import HOW_TO_START, STORY_NOT_FOUND, NO_GROUP_FOUND, \
    ALREADY_IN_GROUP, JOINED_GROUP, RESTARTED, END_OF_STORY, start_new_story
from app.scavenger import CLUE, HINT, START_STORY, JOIN_GROUP, RESTART, ANSWER, JOINED, INFO

from app.scavenger import twiml_response, format_message, determine_message_type, perform_action, \
    split_data, get_next_clue, answer
from app.models.story import Story
from app.models.user import User


USER_PHONE = '+5551234567'
PRIMARY_SERVER_PHONE = '+9998765432'
SECONDARY_SERVER_PHONE = '+7775554321'

def create_request(message="texty text", sender=USER_PHONE, receiver=PRIMARY_SERVER_PHONE):
    request = Request.blank('/api/message')
    request.method = 'POST'
    request.POST.update({
        'From': sender,
        'Body': message,
        'To': receiver,
    })
    return request


def send_message(message, sender=USER_PHONE, receiver=PRIMARY_SERVER_PHONE):
    request = create_request(message=message, sender=sender, receiver=receiver)
    response = request.get_response(app)
    return response.status_int, response.body


class TestScavenger(TestCase):
    """ Integration tests """
    def setUp(self):
        self.testbed = testbed.Testbed()
        self.testbed.activate()
        self.testbed.init_datastore_v3_stub()
        self.testbed.init_memcache_stub()
        ndb.get_context().set_cache_policy(False)
        self.story = Story.from_uid('STORY', default_hint='default hint')
        self.story.put()
        self.start_clue = Clue.from_uid(Clue.build_uid(self.story.uid, 'START'), text='Start the story', hint='clue hint')
        self.start_clue.put()
        self.next_clue = Clue.from_uid(Clue.build_uid(self.story.uid, 'NEXT'), text='You made it!', sender="+555")
        self.next_clue.put()
        self.answer = Answer.from_uid(
            Answer.build_uid('STORY', 'START', 'TRANSITION'),
            pattern=r'my answer is (?P<user_answer>\w+)',
            next_clue=self.next_clue.uid,
            )
        self.answer.put()

    def tearDown(self):
        self.testbed.deactivate()

    def test_post_requires_body(self):
        status, _ = send_message(None)
        self.assertEqual(400, status)

    def test_post_requires_sender(self):
        status, _ = send_message('some message', sender=None)
        self.assertEqual(400, status)

    def test_get_start_info(self):
        status, response = send_message('lkjlkj')
        self.assertIn(HOW_TO_START.text, response)
        self.assertEqual(200, status)

    def test_start_new_story(self):
        status, response = send_message('start {}'.format(self.story.uid))
        self.assertIn(self.start_clue.text, response)
        self.assertEqual(200, status)

    def test_answer_requires_proper_receiver(self):
        self.answer.receiver = SECONDARY_SERVER_PHONE
        self.answer.put()

        send_message('start {}'.format(self.story.uid))

        status, response = send_message('my answer is 42')
        self.assertEqual(200, status)
        self.assertIn(self.start_clue.hint, response)

        status, response = send_message('my answer is 42', receiver=SECONDARY_SERVER_PHONE)
        self.assertEqual(200, status)
        self.assertIn(self.next_clue.text, response)

    def test_flow_through_story(self):
        # start non-existent story
        status, response = send_message('start asdf')
        self.assertEqual(200, status)
        self.assertIn(STORY_NOT_FOUND.text, response)

        # start story
        status, response = send_message('start {}'.format(self.story.uid))
        self.assertEqual(200, status)
        self.assertIn(self.start_clue.text, response)

        # Answer incorrectly
        status, response = send_message('blargh')
        self.assertEqual(200, status)
        self.assertIn(self.start_clue.hint, response)

        # Answer correctly
        status, response = send_message('my answer is 42')
        self.assertIn(self.next_clue.text, response)
        self.assertIn(self.next_clue.sender, response)
        user = User.get_by_id(USER_PHONE)
        self.assertEqual(200, status)
        self.assertEqual(user.data, {'user_answer': '42'})

        # Restart
        status, response = send_message('restart')
        self.assertIn(RESTARTED.text, response)
        self.assertEqual(200, status)
        self.assertIn(self.start_clue.text, response)


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
        self.group = Mock(users=['+1111'])

    def test_includes_messages_in_response(self):
        messages = [Clue(text='Hey there!')]
        response = twiml_response(self.user, None, START_STORY, messages)
        for m in messages:
            self.assertIn(m.text, response)

    def test_sends_copies_to_each_recipient_for_CLUE_or_HINT(self):
        phones = ['+1234', '+555', '+678']
        self.group.users = phones
        messages = [Clue(text='Hey there!')]
        response = twiml_response(self.user, self.group, CLUE, messages)
        for p in phones:
            self.assertIn(p, response)
        response = twiml_response(self.user, self.group, HINT, messages)
        for p in phones:
            self.assertIn(p, response)

    def test_does_not_send_copies_to_each_recipient_for_other_response_types(self):
        phones = ['+1234', '+555', '+678']
        self.group.users = phones
        other_phones = set(phones) - set(['+1234'])
        messages = [Clue(text='Hey there!')]
        response = twiml_response(self.user, self.group, INFO, messages)
        for p in other_phones:
            self.assertNotIn(p, response)
        response = twiml_response(self.user, self.group, JOINED, messages)
        for p in other_phones:
            self.assertNotIn(p, response)

    def test_sends_media_urls_from_clues(self):
        messages = [Clue(text='my_clue', media_url='picture.com/my.png'),
                    Clue(text='my_other_clue', media_url='second.com/my.jpg')]
        response = twiml_response(self.user, None, START_STORY, messages)
        self.assertIn('<Media>picture.com/my.png</Media>', response)
        self.assertIn('<Media>second.com/my.jpg</Media>', response)

    def test_does_not_send_media_more_than_once(self):
        messages = [Clue(text='my_clue', media_url='picture.com/my.png'),
                    Clue(text='my_other_clue')]
        response = twiml_response(self.user, None, START_STORY, messages)
        count = response.count('picture.com/my.png')
        self.assertEqual(1, count)

    def test_extracts_text_from_clues(self):
        messages = [Clue(text='my_clue'), Clue(text='my_other_clue')]
        response = twiml_response(self.user, None, START_STORY, messages)
        self.assertIn('my_clue', response)
        self.assertIn('my_other_clue', response)

    def test_sends_from_specific_number_if_specified(self):
        messages = [Clue(text='my_clue', sender='+1112223333')]
        response = twiml_response(self.user, None, ANSWER, messages)
        self.assertIn('from="+1112223333"', response)

    def test_does_not_include_sender_if_empty(self):
        messages = [Clue(text='my_clue', sender='')]
        response = twiml_response(self.user, None, ANSWER, messages)
        self.assertNotIn('from', response)


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
        result = perform_action(ANSWER, Message('blah'), user, None)
        self.assertEqual([HOW_TO_START.text], [m.text for m in result.messages])

    @patch('app.scavenger.Clue.get_by_id', new=Mock(return_value=None))
    def test_returns_expected_story_not_found(self):
        user = Mock()
        result = perform_action(START_STORY, Message('start blah'), user, None)
        self.assertEqual([STORY_NOT_FOUND], result.messages)

    @patch('app.scavenger.Group')
    @patch('app.scavenger.Clue')
    def test_returns_expected_starting_new_story(self, clue_mock, group_mock):
        clue_mock.get_by_id.return_value = Clue(text='test')
        clue = Clue(text='test')
        group_mock.return_value.current_clue = clue
        group_mock.gen_uid.return_value = 'abcd'
        user = User()
        result = perform_action(START_STORY, Message('start blah'), user, None)
        expected_message_text = [start_new_story('abcd').text, clue.text]
        self.assertEqual(expected_message_text, [m.text for m in result.messages])

    @patch('app.scavenger.Group')
    def test_returns_expected_group_not_found(self, group_mock):
        group_mock.get_by_id.return_value = None
        user = Mock()
        result = perform_action(JOIN_GROUP, Message('join blah'), user, None)
        self.assertEqual([NO_GROUP_FOUND], result)

    @patch('app.scavenger.Group', new=Mock())
    def test_returns_expected_already_in_group(self):
        user = User(group_uid='code')
        result = perform_action(JOIN_GROUP, Message('join code'), user, Group())
        self.assertEqual([ALREADY_IN_GROUP], result)

    @patch('app.scavenger.Group')
    def test_returns_expected_joined_group(self, group_mock):
        clue = Clue(text='clue text')
        group = Mock(uid='code', clue_uid='MYSTORY:MYCLUE', clue=clue)
        group_mock.get_by_id.return_value = group
        user = User()
        result = perform_action(JOIN_GROUP, Message('join code'), user, None)
        self.assertEqual([JOINED_GROUP.text, 'clue text'], [m.text for m in result.messages])

    def test_returns_expected_restarted(self):
        start_message = 'Start the story'
        clue = Clue(text=start_message)
        user = Mock()
        group_mock = Mock(clue_uid='something', clue=clue)
        result = perform_action(RESTART, Message('restart'), user, group_mock)
        self.assertEqual([RESTARTED.text, start_message], [m.text for m in result.messages])

    def test_returns_expected_end_of_story(self):
        clue = Clue(text='blah', answer_uids=[])
        group_mock = Mock(clue=clue)
        user = Mock()
        result = perform_action(ANSWER, Message('asdf'), user, group_mock)
        self.assertEqual([END_OF_STORY.text], [m.text for m in result.messages])


class TestGetNextClue(TestCase):
    def test_answers_clue_properly(self):
        answers = [
            Answer(pattern=r'\w+\s+(?P<second_word>\w+)', next_clue='TWOWORDS'),
            Answer(pattern=r'steve', next_clue="STEVE"),
            Answer(pattern=r'.*', next_clue='CATCHALL'),
        ]
        message = Message('test answer')
        next_clue, answer_data = get_next_clue(message, answers)
        self.assertEqual('TWOWORDS', next_clue)
        self.assertEqual({'second_word': 'answer'}, answer_data)


class TestAnswerClue(TestCase):
    def test_sets_next_clue_on_group(self):
        user = MagicMock()
        answers = [
            Answer(
                pattern=r'\w+\s+(?P<group_word>\w+)',
                next_clue=r'STORY:TWO-WORDS',
            ),
            Answer(
                pattern=r'.*',
                next_clue=r'STORY:GENERIC'
            )
        ]
        message = Message('test answer')

        group_mock = Mock(data={}, clue=Mock(is_endpoint=False, answers=answers))
        result = answer(message, user, group_mock)
        self.assertEqual("STORY:TWO-WORDS", result.group.clue_uid)
        self.assertEqual({'group_word': 'answer'}, result.group.data)

    def test_gives_hints_if_incorrect(self):
        answers = [Answer(pattern=r'tough answer', next_clue='SOME:NEXTCLUE')]
        user = MagicMock()
        message = Message('this is not the correct answer')
        group_mock = Mock(clue=Mock(is_endpoint=False, hint='My Hint', answers=answers))
        result = answer(message, user, group_mock)
        self.assertEqual(['My Hint'], [r.text for r in result.messages])

    def test_requires_matching_receiver(self):
        answers = [
            Answer(pattern=r'.*', next_clue='STORY:FIRSTCLUE', receiver=SECONDARY_SERVER_PHONE),
            Answer(pattern=r'.*', next_clue='STORY:SECONDCLUE')
        ]
        user = MagicMock()
        message = Message('correct answer')
        group_mock = Mock(clue=Mock(is_endpoint=False, hint='My Hint', answers=answers))

        result = answer(message, user, group_mock)

        self.assertEqual(CLUE, result.response_type)
        self.assertEqual('STORY:SECONDCLUE', result.group.clue_uid)


    def test_requires_matching_receiver(self):
        answers = [
            Answer(pattern=r'.*', next_clue='STORY:FIRSTCLUE', receiver=SECONDARY_SERVER_PHONE),
            Answer(pattern=r'.*', next_clue='STORY:SECONDCLUE')
        ]
        user = MagicMock()
        message = Message('correct answer')
        group_mock = Mock(clue=Mock(is_endpoint=False, hint='My Hint', answers=answers))
        result = answer(message, user, group_mock)
        self.assertEqual(CLUE, result.response_type)
        self.assertEqual('STORY:SECONDCLUE', result.group.clue_uid)


    def test_matches_if_media_given(self):
        answers = [
            Answer(pattern=r'.*', next_clue='STORY:FIRSTCLUE', require_media=True),
            Answer(pattern=r'.*', next_clue='STORY:SECONDCLUE')
        ]
        user = MagicMock()
        message_with_media = Message('correct answer', media_url='www.example.com/caturday.png')
        group_mock = Mock(clue=Mock(is_endpoint=False, hint='My Hint', answers=answers))

        result_with_media = answer(message_with_media, user, group_mock)

        self.assertEqual('STORY:FIRSTCLUE', result_with_media.group.clue_uid)

    def test_requires_media(self):
        answers = [
            Answer(pattern=r'.*', next_clue='STORY:FIRSTCLUE', require_media=True),
            Answer(pattern=r'.*', next_clue='STORY:SECONDCLUE')
        ]
        user = MagicMock()
        message_without_media = Message('correct answer')
        group_mock = Mock(clue=Mock(is_endpoint=False, hint='My Hint', answers=answers))

        result_without_media = answer(message_without_media, user, group_mock)

        self.assertEqual('STORY:SECONDCLUE', result_without_media.group.clue_uid)
