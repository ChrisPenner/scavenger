from app.base import BaseHandler


class FormHandler(BaseHandler):
    def get(self):
        self.render('form.html')
