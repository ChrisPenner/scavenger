from app.models.message import Message

HOW_TO_START = Message("Text 'start' and then your three word code to start an adventure!")
STORY_NOT_FOUND = Message("Story not found")
NO_GROUP_FOUND = Message("Sorry, can't find a group for that code")
ALREADY_IN_GROUP = Message("You're already in that group")
JOINED_GROUP = Message("You've joined the group! Here's the last message:")
RESTARTED = Message("Restarted")
END_OF_STORY = Message("Looks like you've hit the end of the story, text 'restart' to try again!")
CODE_ALREADY_USED = Message("Looks like this code has already been used! Try texting 'restart' "
                            "if you already entered a code.")


def start_new_story(code):
    return Message(("Starting the adventure! Your friends can text 'join {}' to join you. "
                   "Throughout the adventure please guess as much as you like! You can text 'hint' to get some help, "
                   "or text 'clue' to repeat the last clue you received! Good luck!").format(code))
