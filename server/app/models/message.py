class Message(object):
    def __init__(self, text, media_url=None):
        self.text = text
        self.media_url = media_url

    def __repr__(self):
        return 'Message({})'.format(repr(self.__dict__))

