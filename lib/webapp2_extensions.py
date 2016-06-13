import json

from webapp2 import abort


def parse_args(params, args):
    results = {}
    for name, type, required in args:
        if name not in params:
            abort(400, '{name} is required'.format(name=name))
        if type is dict:
            results[name] = json.loads(params[name])
        else:
            results[name] = type(params[name])
    return results


class restful_api(object):
    def __init__(self, content_type):
        self.content_type = content_type

    def __call__(self, cls):
        def format_response(f):
            def wrapped(handler, *args, **kwargs):
                response = f(handler, *args, **kwargs)
                if not response:
                    return
                handler.response.headers['Content-Type'] = self.content_type
                if isinstance(response, basestring):
                    handler.response.body = response
                else:
                    handler.response.body = json.dumps(response)
            return wrapped

        for method in ['get', 'post', 'put', 'patch', 'delete']:
            if hasattr(cls, method):
                wrapped = format_response(getattr(cls, method))
                setattr(cls, method, wrapped)
        return cls
