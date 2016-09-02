import logging

from webapp2 import RequestHandler

from app.models.story_code import generate_codes


class GenerateCodesHandler(RequestHandler):
    def post(self):
        story_uid = self.request.get('story-uid')
        amount = self.request.get('amount')
        single_use = self.request.get('single-use')
        if not story_uid or not amount or not single_use:
            logging.error('story-uid, single-use, and amount are required')
            return self.abort(400, 'story-uid, single-use, and amount are required')
        codes = generate_codes(story_uid, amount, single_use)
        self.response.body = '\n'.join(c.word_string for c in codes)
