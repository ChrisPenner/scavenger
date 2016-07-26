import json
import logging

from webapp2 import abort


def parse_args(params, args):
    results = {}
    for name, kind, required in args:
        if (name not in params):
            if required:
                abort(400, '{name} is required'.format(name=name))
            else:
                continue
        results[name] = params[name]
    return results


# def parse_form_data(params, args):
#     results = {}
#     for name, kind, required in args:
#         if name not in params:
#             abort(400, '{name} is required'.format(name=name))
#         if kind is dict:
#             results[name] = json.loads(params[name])
#         else:
#             results[name] = kind(params[name])
#     return results


data_methods = ['put', 'patch', 'post']
class restful_api(object):
    def __init__(self, content_type):
        self.content_type = content_type

    def __call__(self, cls):
        def format_response(f, method):
            def wrapped(handler, *args, **kwargs):
                if method in data_methods:
                    try:
                        kwargs['data'] = json.loads(handler.request.body)
                    except ValueError:
                        logging.error("Failed to serialize in %s.%s: %s", cls.__name__, method, handler.request.body)
                        return handler.abort(400, 'Invalid JSON body')
                response = f(handler, *args, **kwargs)
                if response is None:
                    logging.info("Nothing returned from %s.%s", cls.__name__, method)
                    return
                handler.response.headers['Content-Type'] = self.content_type
                logging.info("Handler response for %s.%s is: %s", cls.__name__, method, response)
                if isinstance(response, basestring):
                    handler.response.body = response
                else:
                    handler.response.body = json.dumps(response)
            return wrapped

        for method in ['index', 'get', 'post', 'put', 'patch', 'delete']:
            if hasattr(cls, method):
                wrapped = format_response(getattr(cls, method), method)
                setattr(cls, method, wrapped)
        return cls
