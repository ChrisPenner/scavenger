from app.models.message import Message

HOW_TO_START = Message(text="Text in your code to activate the message service")
STORY_NOT_FOUND = Message(text="Sorry, I can't find anything for that code,\n"
                          "Try texting\n\nstart three word code\n\n"
                          "Or ask the person who gave you the code for help!")
NO_GROUP_FOUND = Message(text="Sorry, I can't find a group for that code")
ALREADY_IN_GROUP = Message(text="You're already in that group")
JOINED_GROUP = Message(text="You've joined the group! Here's the last message:")
RESTARTED = Message(text="Restarted")
CODE_ALREADY_USED = Message(text="Looks like this code has already been used! Try texting 'restart' "
                            "if you already entered a code.")
START_INSTRUCTIONS = Message(text="Try texting\n\nstart <three word code>\n\nto get started, "
                             "or ask the person who gave you the code for help!")
JOIN_GROUP_INSTRUCTIONS = Message(text="Try texting\n\njoin <code>\n\n"
                                  "or ask the person who gave you the code for help!")
INTRO_INSTRUCTIONS = Message(text="Glad you're here! Throughout the experience you can text "
                                  "'hint' to get some help, or text 'clue' to repeat the last "
                                  "clue you received! Good luck!")
