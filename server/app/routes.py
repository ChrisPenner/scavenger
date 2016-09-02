from webapp2 import Route
from webapp2_extras.routes import PathPrefixRoute

from app.backup import BackupHandler
from app.generate_codes import GenerateCodesHandler
from webapp2_extensions import ResourceRoutes

from scavenger import TwilioHandler
from app.models.story import Story
from app.models.clue import Clue
from app.models.answer import Answer

ROUTES = [
    PathPrefixRoute('/api', [
        ResourceRoutes('stories', Story),
        ResourceRoutes('clues', Clue),
        ResourceRoutes('answers', Answer),
        ]),
    PathPrefixRoute('/admin', [
        Route('/backup', BackupHandler),
        Route('/gen-codes', GenerateCodesHandler),
    ]),
    Route('/messages', TwilioHandler),
]
