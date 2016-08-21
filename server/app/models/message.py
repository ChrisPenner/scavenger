class Message(object):
    def __init__(self, text, media_url=None, sender=None, receiver=None):
        self.text = text
        self.media_url = media_url
        self.sender = sender
        self.receiver = receiver

    def __repr__(self):
        return 'Message({})'.format(repr(self.__dict__))

