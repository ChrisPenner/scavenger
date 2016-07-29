import logging
from webapp2 import SimpleRoute, Route

from app.base import BaseHandler
from scavenger import TwilioHandler
from api.stories import StoryHandler
from api.clues import ClueHandler
from api.answers import AnswerHandler


class AppHandler(BaseHandler):
    def get(self):
        logging.info('App handler')
        self.render('app.html')

ROUTES = [
    Route('/twilio', TwilioHandler),
    Route('/clues/<uid:[^/]+>.json', ClueHandler),
    Route('/clues.json', handler=ClueHandler, handler_method='index'),
    Route('/stories.json', handler=StoryHandler, handler_method='index'),
    Route('/stories/<uid:[^/]+>.json', StoryHandler),
    Route('/answers/<answer_id:[^/]+>.json', AnswerHandler),
    Route('/answers.json', handler=AnswerHandler, handler_method='index'),
    SimpleRoute('/.*', AppHandler),
]
