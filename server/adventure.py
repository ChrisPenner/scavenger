affirmative = r'yup|yes|yeah|^y$|ok|sure|sounds good|affirmative'
negative = r'nope|no|^n$|never|nah|negative'
catchall = r'.*'
MEDIA_URL = '/media/'

story = {
    'story_id': 'POEM',
    'default_hint': 'Try responding yes or no',
    'clues': ['start', 'in-trouble', 'will-help', 'wont-help', 'send-cat-photo',
              'short-poem', 'long-poem', 'medium-poem', 'clue_id'],
}

clues = [
    {
        'clue_id': 'start',
        'story': 'POEM',
        'text': "Hey there! What's your name?",
    },
    {
        'clue_id': 'in-trouble',
        'story': 'POEM',
        'text': "Nice to meet you {user_name}. I'm in a bit of trouble, think you could help me out?",
        'hint': "C'mon, it's a simple yes or no question! Help me out??",
    },
    {
        'clue_id': 'will-help',
        'story': 'POEM',
        'text': "Awesome! Okay, for reasons that will soon become clear, I need you to write a limerick about a Walrus. Let's hear it!",
        'media_url': MEDIA_URL + 'walrus.png',
    },
    {
        'clue_id': 'wont-help',
        'story': 'POEM',
        'text': "Really? It's going to be like that? I'm going to text you pictures of cats until they soften you up, will you help now?",
    },
    {
        'clue_id': 'send-cat-photo',
        'story': 'POEM',
        'text': "Stubborn aren't you? Here's another one, change your mind yet?",
    },
    {
        'clue_id': 'short-poem',
        'story': 'POEM',
        'text': "Hrmm, a bit short but I guess it'll do. This'll really help my english mark! Thanks! END",
    },
    {
        'clue_id': 'long-poem',
        'story': 'POEM',
        'text': "Wow, you really like to write about Walrus's! Thanks! This'll really help my english mark! END",
    },
    {
        'clue_id': 'medium-poem',
        'story': 'POEM',
        'text': "This'll do nicely thanks! It'll really help my english mark! END",
    }
]

answers = [
    {
        'story': 'POEM',
        'clue_id': 'start',
        'pattern': r'(?P<user_name>\w+)',
        'next_clue': 'in-trouble'
    },
    {
        'clue_id': 'in-trouble',
        'story': 'POEM',
        'pattern': affirmative,
        'next_clue': 'will-help',
    },
    {
        'clue_id': 'in-trouble',
        'story': 'POEM',
        'pattern': negative,
        'next_clue': 'wont-help',
    },
    {
        'clue_id': 'will-help',
        'story': 'POEM',
        'pattern': r'^.{,50}$',
        'next_clue': "short-poem",
    },
    {
        'clue_id': 'will-help',
        'story': 'POEM',
        'pattern': r'^.{100,}$',
        'next_clue': "long-poem"
    },
    {
        'clue_id': 'will-help',
        'story': 'POEM',
        'pattern': catchall,
        'next_clue': ''"medium-poem",
    },
    {
        'clue_id': 'wont-help',
        'story': 'POEM',
        'pattern': affirmative,
        'next_clue': "will-help",
    },
    {
        'clue_id': 'wont-help',
        'story': 'POEM',
        'pattern': catchall,
        'next_clue': "send-cat-photo",
    },
    {
        'clue_id': 'send-cat-photo',
        'story': 'POEM',
        'pattern': affirmative,
        'next_clue': "will-help",
    },
    {
        'clue_id': 'send-cat-photo',
        'story': 'POEM',
        'pattern': catchall,
        'next_clue': "send-cat-photo",
    },
]
