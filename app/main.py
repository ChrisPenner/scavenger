""" main  """
from flask import Flask, render_template
from restful_api_extension import Api
from scavenger import TwilioHandler
from views.story import StoryHandler

app = Flask(__name__)
app.config['BUNDLE_ERRORS'] = True
api = Api(app)
api.add_resource(TwilioHandler, '/')
api.add_resource(StoryHandler, '/story/<string:id>')


@app.route('/index')
def hello():
    """Return a friendly HTTP greeting."""
    return render_template('index.html')


@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, Nothing at this URL.', 404


@app.errorhandler(500)
def application_error(e):
    """Return a custom 500 error."""
    return 'Sorry, unexpected error: {}'.format(e), 500
