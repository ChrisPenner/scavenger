class Message(object):
    def __init__(self, text, media_url=None):
        self.text = text
        self.media_url = media_url

    def __str__(self):
        return str(self.__dict__)

    __repr__ = __str__
