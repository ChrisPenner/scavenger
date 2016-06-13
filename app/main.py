""" main  """
from webapp2 import Route, WSGIApplication
import logging

from scavenger import TwilioHandler
from views.story import StoryHandler


def handle_404(request, response, exception):
    logging.exception(exception)
    response.write('Page not found')
    response.set_status(404)


def handle_500(request, response, exception):
    logging.exception(exception)
    response.write('A server error occurred!')
    response.set_status(500)


app = WSGIApplication([
    Route('/story/<id:[^/]+>', StoryHandler),
    Route('/', TwilioHandler),
], debug=True)

app.error_handlers[404] = handle_404
# app.error_handlers[500] = handle_500
