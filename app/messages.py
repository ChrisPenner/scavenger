HOW_TO_START = {"text": "Text 'start CODE' with your story code to start and adventure!"}
STORY_NOT_FOUND = {"text": "Story not found"}
NO_GROUP_FOUND = {"text": "Sorry, can't find a group for that code"}
ALREADY_IN_GROUP = {"text": "You're already in that group"}
JOINED_GROUP = {"text": "You've joined the group! Here's the last message:"}
RESTARTED = {"text": "Restarted"}
END_OF_STORY = {"text": "Looks like you've hit the end of the story, text 'restart' to try again!"}
SEPARATOR_STRING = '\n---\n'


def start_new_story(code):
    return {'text': "Starting the adventure! Your friends can text 'join {}' to join you.".format(code)}
