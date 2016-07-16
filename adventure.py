affirmative = r'yup|yes|yeah|^y$|ok|sure|sounds good|affirmative'
negative = r'nope|no|^n$|never|nah|negative'
catchall = r'.*'
MEDIA_URL = '/media/'

story = {
    'default_hint': {"text": 'Try responding yes or no'},
    'clues': {
        'start': {
            'text': "Hey there! What's your name?",
            'answers': [
                (r'(?P<user_name>\w+)', 'in-trouble'),
            ],
        },
        'in-trouble': {
            'text': "Nice to meet you {user_name}. I'm in a bit of trouble, think you could help me out?",
            'answers': [
                (affirmative, 'will-help'),
                (negative, 'wont-help'),
            ],
            'hint': {'text': "C'mon, it's a simple yes or no question! Help me out??"},
        },
        'will-help': {
            'text': "Awesome! Okay, for reasons that will soon become clear, I need you to write a limerick about a Walrus. Let's hear it!",
            'media_url': MEDIA_URL + 'walrus.png',
            'answers': [
                (r'^.{,50}$', "short-poem"),
                (r'^.{100,}$', "long-poem"),
                (catchall, "medium-poem"),
            ],
        },
        'wont-help': {
            'text': "Really? It's going to be like that? I'm going to text you pictures of cats until they soften you up, will you help now?",
            'answers': [
                (affirmative, "will-help"),
                (catchall, "send-cat-photo")
            ],
        },
        'send-cat-photo': {
            'text': "Stubborn aren't you? Here's another one, change your mind yet?",
            'answers': [
                (affirmative, "will-help"),
                (catchall, "send-cat-photo")
            ],
        },
        'short-poem': {
            'text': "Hrmm, a bit short but I guess it'll do. This'll really help my english mark! Thanks! END",
            'answers': None,
        },
        'long-poem': {
            'text': "Wow, you really like to write about Walrus's! Thanks! This'll really help my english mark! END",
            'answers': None,
        },
        'medium-poem': {
            'text': "This'll do nicely thanks! It'll really help my english mark! END",
            'answers': None,
        },
    }
}
