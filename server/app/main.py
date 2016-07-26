""" main  """
from webapp2 import SimpleRoute, Route, WSGIApplication
import logging

from app.base import BaseHandler
from scavenger import TwilioHandler
from api.stories import StoryHandler
from api.clues import ClueHandler
from api.answers import AnswerHandler


class AppHandler(BaseHandler):
    def get(self):
        logging.info('App handler')
        self.render('app.html')


def handle_404(request, response, exception):
    logging.exception(exception)
    response.write('Page not found')
    response.set_status(404)


def handle_500(request, response, exception):
    logging.exception(exception)
    response.write('A server error occurred!')
    response.set_status(500)


app = WSGIApplication([
    Route('/twilio', TwilioHandler),
    Route('/clues/<uid:[^/]+>.json', ClueHandler),
    Route('/stories/<story_id:[^/]+>/clues.json', handler=ClueHandler, handler_method='index'),
    Route('/stories.json', handler=StoryHandler, handler_method='index'),
    Route('/stories/<uid:[^/]+>.json', StoryHandler),
    Route('/answers/<answer_id:[^/]+>.json', AnswerHandler),
    Route('/clues/<clue_id:[^/]+>/answers.json', handler=AnswerHandler, handler_method='index'),
    SimpleRoute('/.*', AppHandler),
], debug=True)

app.error_handlers[404] = handle_404
app.error_handlers[500] = handle_500


