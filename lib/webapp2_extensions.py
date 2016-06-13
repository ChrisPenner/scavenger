import json

from webapp2 import abort


def parse_args(params, args):
    for name, type, required in args:
        if name not in params:
            abort(400, '{name} is required'.format(name=name))
    return params


def restful_api(cls):
    def format_response(f):
        def wrapped(handler, *args, **kwargs):
            response = f(handler, *args, **kwargs)
            print 'RESPONSE:', response
            if not response:
                return
            handler.response.headers['Content-Type'] = 'application/json'
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
