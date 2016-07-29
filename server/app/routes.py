import logging
from webapp2 import SimpleRoute, Route
from webapp2_extras.routes import PathPrefixRoute
from webapp2_extensions import ResourceRoutes

from app.base import BaseHandler
from scavenger import TwilioHandler
from app.models.story import Story
from app.models.clue import Clue
from app.models.answer import Answer


class AppHandler(BaseHandler):
    def get(self):
        logging.info('App handler')
        self.render('app.html')

ROUTES = [
    PathPrefixRoute('/api', [
        ResourceRoutes('stories', Story),
        ResourceRoutes('clues', Clue),
        ResourceRoutes('answers', Answer),
        ]),
    Route('/twilio', TwilioHandler),
    SimpleRoute('/.*', AppHandler),
]
