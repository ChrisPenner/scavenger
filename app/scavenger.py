from flask_restful import Resource
from EntityHelper import find_user_by_from


class ScavengerHandler(Resource):
    def __init__(self, message, em):
        self.message = incomingMessage
        self.entity_manager = em
        self.user = None
        self.party = None
        self.hunt = None
        self.clue = None
        self.prevClue = None
        self.answer = None
        self.story = None

        self.globals = {
            'authGlobals': {
                "regex": "/(.*)/i",
                "smsresponse": "In order to start your adventure you must text \"Start\".",
            },
            'noAuthGlobals': [
                {
                    'regex': "/.*/",
                    "smsresponse": "You don't appear the be registered."
                },
            ],
        }

    def create_response():
        incoming_message_type = LogTypes.TYPE_UNKNOWN
        outgoing_message_type = LogTypes.TYPE_UNKNOWN

        response_body = "<Response/>"
        body = self.message["Body"]
        fromPhone = self.message["From"]

        response_to = []
        self.user = find_user_by_from(fromPhone, self.entity_manager)

        if self.user:
            self.party = self.user.getParty()

        # check to make sure that they are a valid sender
        if self.party:
            # Get the clue that that user is on
            self.hunt = self.find_hunt_by_party(self.party, self.entity_manager)
            if self.hunt:
                self.prevClue = self.clue
                self.clue = self.hunt.get_current_clue()

            if self.clue:
                # Check for global commands then the correct answer
                # Check if they sent a correct Answer
                #  global_result = self._checkGlobals(body, True, True, self.clue)
                response_found = False

                if preg_match("/^clue/i", body.strip()):
                    response_found = True
                    response_body = self.replace_variables(self.clue.get_value())
                elif preg_match("/^hint/i", body.strip()):
                    responseFound = True
                    hintFound = False

                    outgoing_message_type = LogTypes.TYPE_HINT
                    hint = self.find_hints_for_clue(self.clue, self.hunt, self.entity_manager)

                    if hint is not None:
                        response_body = hint.getValue()
                    else:
                        response_body = self.get_default_hint(1, self.entity_manager)
                elif preg_match("/^restart/i", body.strip()):
                    responseFound = True
                    #  self.clue = None
                    self.clue = self.GetFirstClue(1, self.entity_manager)
                    response_body = self.clue.getValue()
                    self.hunt.setCurrentClue(self.clue)
                    self.entity_manager.flush()
                elif preg_match("/^quit\s?party/i", body.strip()):
                    self.user.set_party(None)
                    self.entity_manager.flush()
                if not responseFound:
                    self.answer = self.find_answer_for_clue_by_value(self.clue, self.message, self.entity_manager) # clue, sms, mms
                    incoming_message_type = LogTypes.TYPE_ANSWER
                    if self.answer:
                        # Get the next clue from the answer and format that as a
                        next_clue = self.answer.get_clue()

                        if next_clue:
                            # Send the next clue
                            # Update the currentClue
                            response_body = self.replace_variables(next_clue.get_value())
                            self.hunt.set_current_clue(next_clue)
                            self.entity_manager.flush()
                            outgoing_message_type = LogTypes.TYPE_CLUE
                    else:
                        response_body = self.get_end_message(1, self.entity_manager)
                        # self.hunt.setCurrentClue(None)
                        self.entity_manager.flush()
                        outgoing_message_type = LogTypes.TYPE_END
                else:
                    # They got the answer wrong - send them a hint
                    # If we don't have hints then suggest that they skip the question and message Adam / Berkley that shits going down
                    hintFound = False

                    outgoing_message_type = LogTypes.TYPE_HINT
                    hint = self.find_hints_for_clue(self.clue, self.hunt, self.entity_manager)

                    if hint != None:
                        response_body = hint.getValue()
                    else:
                        response_body = self.GetDefaultHint(1, self.entity_manager)
                else:
                    if incoming_message_type == LogTypes.TYPE_UNKNOWN:
                        incoming_message_type = LogTypes.TYPE_GLOBAL
                    if outgoing_message_type == LogTypes.TYPE_UNKNOWN:
                        outgoing_message_type = LogTypes.TYPE_GLOBAL
            else:
                incoming_message_type = LogTypes.TYPE_GLOBAL
                outgoing_message_type = LogTypes.TYPE_GLOBAL
                responseFound = False

                if preg_match("/^quit\s?party/i", body.strip()):
                    self.user.setParty(None)
                    self.entity_manager.flush()
                else:
                    if preg_match("/^start\.?/i", body.strip()):
                        # Send first clue
                        responseFound = True
                        self.clue = self.get_first_clue(1, self.entity_manager)
                        response_body = self.clue.getValue()
                        self.hunt.set_current_clue(self.clue)
                        self.entity_manager.flush()
                        incoming_message_type = LogTypes.TYPE_START
                        outgoing_message_type = LogTypes.TYPE_START

                    if not response_found:
                        response_body = self._checkGlobals(body, True)
        else:
            incoming_message_type = LogTypes.TYPE_GLOBAL
            outgoing_message_type = LogTypes.TYPE_GLOBAL

            # Do global commands for unregistered users
            response_body = self._checkGlobals(body)

        # Log Incoming Message
        data = array('from' : self.message["From"], 'to' : self.message["To"], 'value' : self.message["Body"], 'data' : json_encode(self.message), 'direction' : LogTypes.DIRECTION_INCOMING, 'type' : incoming_message_type)
        LogMessage(data, self.entity_manager, self.user, self.hunt, self.prevClue, self.answer)

        # Log Outgoing Message
        data = array('from' : self.message["To"], 'to' : self.message["From"], 'value' : response_body, 'data' : format_TwiML(response_body), 'direction' : LogTypes.DIRECTION_OUTGOING, 'type' : outgoing_message_type)

        LogMessage(data, self.entity_manager, self.user, self.hunt, self.clue)

        if self.party is not None:
            for user in self.party.get_users() {
                if (user.get_state() == 1)
                {
                    response_to.append(user.get_phone())
                }
            }
        else:
            response_to.append(self.message["From"])

        response = { "body" : response_body, "recipients" : response_to }
        return response

    def _check_globals(body, is_authenticated=False, has_started=False, cur_clue=None):
        response_to_global = ""

        codes = None
        if preg_match("/^join ?(.+)/i", body.strip(), codes):
            story = self.find_story_by_code(codes[1], self.entity_manager)
            if story:
                hunt = self.add_hunt_to_story(story)
                if story.get_type() == 1:
                    self.clue = story.get_first_clue() # Return first clue of story
                    hunt.set_current_clue(self.clue)
                    self.hunt = hunt
                    self.add_user_to_hunt(hunt)

                    return self.clue.get_value()
                else:
                    self.hunt = hunt
                    return self.add_user_to_hunt(hunt)
            else:
                hunt = self.find_hunt_by_code(codes[1], self.entity_manager)

                if hunt:
                    self.hunt = hunt
                    return self.add_user_to_hunt(hunt)

                return "We don't seem to have that code on file."


        if is_authenticated:
            for command in self.globals["authGlobals"]:
                if (preg_match(command["regex"], body)):
                    return command["smsresponse"]
        else:
            for command in self.globals["noAuthGlobals"]:
                if preg_match(command["regex"], body):
                    return command["smsresponse"]
        return responseToGlobal

    @staticmethod
    def find_current_clue_by_user(user, entity_manager):
        repository = entity_manager.get_repository("Dummy")

        dummy = repository.find_one_by({'user' : user.get_id()})
        return dummy

    @staticmethod
    def find_hunt_by_party(party, entity_manager):
        repository = entity_manager.get_repository("Hunt")
        hunt = repository.find_one_by(array('party' : party, 'end' : None))
        return hunt

    @staticmethod
    def find_answer_for_clue_by_value(clue, message=None):
        cur_answer = None

        if message["body"] or message["num_media"] >= 1:
            acceptable_answers = clue.get_answers()
            for anser in acceptable_answers
                if answer.get_value() == "/media/":
                    if message["num_media"] >= 1:
                        cur_answer = answer
                        break
                else if preg_match(answer.getValue(), message["Body"].strip()):
                    curAnswer = answer
                    break
        return curAnswer

    @staticmethod
    def get_first_clue(story_id=1, entity_manager):
        story = entity_manager.find("story", story_id)
        return story.get_first_clue()

    @staticmethod
    def get_default_hint(story_id=1, entity_manager):
        story = entity_manager.find("story", story_id)

        return story.get_default_hint()

    @staticmethod
    def get_end_message(story_id=1, entity_manager):
        story = entity_manager.find("Story", story_id)
        return story.get_end_message()

    @staticmethod
    def find_hints_for_clue(cur_clue, cur_hunt, entity_manager):
        cur_hint = None
        repository = entity_manager.get_repository("hint")
        search_params = array('clue' : cur_clue.get_id(),
                              'state' : 1)
        order_params = array('priority' : 'ASC')
        hints = repository.find_by(search_params, order_params)
        hint_count = count(hints)

        repository = entity_manager.get_repository("Log")
        search_params = array('hunt' : cur_hunt.get_id(),
                              'clue' : cur_clue.get_id(),
                              'direction' : LogTypes.DIRECTION_OUTGOING,
                              'type' : LogTypes.TYPE_HINT,
                              'state' : 1)
        logs = repository.find_by(search_params)
        hints_sent = count(logs)

        cur_hint = hints[hints_sent % hint_count]

        return cur_hint

    @staticmethod
    def find_story_by_code(code, entity_manager):
        repository = entity_manager.get_repository("Story")
        story = repository.find_one_by(array('code' : strtoupper(code), 'state' : 1))
        return story

    @staticmethod
    def find_hunt_by_code(code, entity_manager):
        repository = entity_manager.get_repository("Hunt")
        hunt = repository.find_one_by(array('code' : strtoupper(code), 'end' : None, 'state' : 1))

        return hunt

    def add_hunt_to_story(self, story):
        hunt = (object) [
            'id' : -1,
            'start' : "",
            'end' : "",
            'hints_used' : 0,
            'code' : '',
            'clue' : -1,
            'max_users' : story.get_max_users(),
            'story' : story.get_id(),
            'party' : -1
        ]

        return create_hunt(hunt, self.entity_manager)

    def add_user_to_hunt(hunt):
        from_phone = self.message["From"]
        cur_party = hunt.get_party()

        # if the hunt has no party set then lets create one
        if not cur_party:
            party = new Party()

            self.entity_manager.persist(party)

            hunt.set_party(party)
            self.entity_manager.flush()

            cur_party = party

        if not self.user:
            user = {'id' : -1,
                    'name' : '',
                    'email' : '',
                    'phone' :  str(from_phone),
                    'party' : cur_party.get_id(),
            }
            try { add_edit_user(user, self.entity_manager) } catch(Exception e) {return e.get_message()}
        else:
            if self.party:
                if (self.party.get_id() == cur_party.get_id()):
                    return "You've already joined this group."
                else:
                    return "You're already registered to a group - you'll have to text 'quit party' to join this one."

            user = { 'id' : self.user.get_id(),
                    'name' : self.user.get_name(),
                    'email' : self.user.get_email(),
                    'phone' : self.user.get_phone(),
                    'party' : cur_party.get_id(),
            }

            try { add_edit_user(user, self.entity_manager) } catch(Exception e) {return e.get_message()}

        return "You've joined the party!"

    def replace_variables(self, message_out):
        matches = []
        preg_match_all('/\[((?:a\d+)+)(?:,(\d+)?)?(?:,(.+)?)?]/', message_out, matches)

        if len(matches[1]) > 0:
            answers = matches[1][0]
            max_chars = matches[2][0]
            value = matches[3][0]
            answer_list = explode('a', trim(answers, "a"))

            for answer_id in answer_list:
                if self.answer and self.answer.get_id() == answer_id:
                    if strlen(self.message["Body"]) <= max_chars:
                        value = self.message["Body"]
                        break
                else:
                    repository = self.entity_manager.get_repository("Log")
                    log = repository.find_one_by(array('answer' : answer_id, 'hunt' : self.hunt, 'type' : 3), array('id' : 'DESC'))

                    if log:
                        if strlen(log.get_value()) <= max_chars:
                            value = log.get_value()
                            break

            value = preg_replace('/\^|\&|Ø|<|>/', "", value)
            return preg_replace('/\[((?:a\d+)+)(?:,(\d+)?)?(?:,(.+)?)?]/', value, message_out)
        return message_out
