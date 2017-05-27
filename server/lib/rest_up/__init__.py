import json
import logging
from functools import partial

from webapp2 import abort, Route, RequestHandler
from webapp2_extras.routes import PathPrefixRoute

from google.appengine.ext import ndb

def decamelize(s):
    if not s:
        return ""
    def reducer(acc, c):
        if c.isupper():
            return acc + '_' + c.lower()
        return acc + c
    return reduce(reducer, s[1:], s[0].lower())

class UserFacingError(Exception):
    pass

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


def parse_form_data(params, args):
    results = {}
    for name, kind, required in args:
        if name not in params:
            abort(400, '{name} is required'.format(name=name))
        if kind is dict:
            results[name] = json.loads(params[name])
        else:
            results[name] = kind(params[name])
    return results


def serialize_json(obj, serializers=None):
    serializers = serializers or []
    for serializer in serializers:
        try:
            return serializer(obj)
        except TypeError:
            continue
    raise TypeError("Failed to serialize {}".format(repr(obj)))


def serialize_datetime(dt):
    if hasattr(dt, 'isoformat'):
        return dt.isoformat()
    raise TypeError('Received non-date object')


def serialize_key(key):
    if hasattr(key, 'id'):
        return key.id()
    raise TypeError('Received non-key object')

data_methods = ['put', 'patch', 'post']
class restful_api(object):
    def __init__(self, content_type, custom_serializer=None):
        self.content_type = content_type
        self.custom_serializer = custom_serializer

    def __call__(self, cls):
        def format_response(f, method):
            def wrapped(handler, *args, **kwargs):
                if method in data_methods:
                    try:
                        kwargs['data'] = json.loads(handler.request.body)
                    except ValueError:
                        logging.error("Failed to serialize in %s.%s: %s", cls.__name__, method, handler.request.body)
                        return handler.abort(400, 'Invalid JSON body')
                return_value = f(handler, *args, **kwargs)
                meta = {}
                if return_value is None:
                    logging.info("Nothing returned from %s.%s", cls.__name__, method)
                    return
                elif isinstance(return_value, tuple):
                    meta, return_value = return_value
                handler.response.headers['Content-Type'] = self.content_type
                response = {}
                response.update(meta)
                response['data'] = return_value
                logging.info("Handler response for %s.%s is: %s", cls.__name__, method, response)
                handler.response.body = json.dumps(response, default=self.custom_serializer)
            return wrapped

        for method in ['index', 'get', 'post', 'put', 'patch', 'delete']:
            if hasattr(cls, method):
                wrapped = format_response(getattr(cls, method), method)
                setattr(cls, method, wrapped)
        return cls


def create_resource_handler(Model, method=None, id_key='uid'):
    custom_serializers = getattr(Model, 'SERIALIZERS', None)
    serializer_func = partial(serialize_json, serializers=custom_serializers)

    def default_index(self):
        params = {decamelize(k): v for (k,v) in self.request.GET.iteritems()}
        paged = json.loads(params.pop('paged', 'true'))
        sort_by = params.pop('sort_by', None)
        limit = int(params.pop('limit', 20))
        cursor = ndb.Cursor(urlsafe=params.pop('cursor', None))
        visible_fields = getattr(Model, 'VISIBLE_FIELDS', None)
        query = Model.query()
        meta = {}

        if sort_by:
            descending = False
            if sort_by.startswith('-'):
                descending = True
                sort_by = sort_by[1:]
            if not hasattr(Model, decamelize(sort_by)):
                raise UserFacingError("Couldn't sort by non-existent property %s" % sort_by)
            prop = getattr(Model, decamelize(sort_by))
            if descending:
                query = query.order(-prop)
            else:
                query = query.order(prop)

        for (k, v) in params.iteritems():
            if not hasattr(Model, k):
                raise UserFacingError("Couldn't query on non-existent field %s" % k)
            query = query.filter(getattr(Model, k) == v)

        if not paged:
            results = query.fetch()
        else:
            results, next_cursor, has_more = query.fetch_page(limit, start_cursor=cursor)
            if has_more:
                meta.update({ 'cursor': next_cursor.urlsafe() })
        items = (entity.to_dict(include=visible_fields) for entity in results)
        return (meta, {item[id_key]: item for item in items})

    def default_get(_, uid):
        item = Model.get_by_id(uid)
        if item is None:
            abort(400, 'No Resource for that id')
        visible_fields = getattr(Model, 'VISIBLE_FIELDS', None)
        return item.to_dict(include=visible_fields)

    @ndb.transactional(xg=True)
    def default_put(_, uid, data):
        logging.info('PUT: %s, %s', uid, data)
        item = Model.get_by_id(uid) or Model.from_uid(uid)
        if hasattr(Model, 'EDITABLE_FIELDS'):
            data = { k:v for k,v in data.iteritems() if k in Model.EDITABLE_FIELDS }
        item.populate(**data)
        item.put()

        visible_fields = getattr(Model, 'VISIBLE_FIELDS', None)
        return item.to_dict(include=visible_fields)

    def default_delete(_, uid):
        logging.info('PUT: %s', uid)
        Model.build_key(uid=uid).delete()
        return {}

    class ResourceHandler(RequestHandler):
        def handle_exception(self, exception, debug):
            logging.exception('%s: %s', Model.__name__, exception)
            if not isinstance(exception, UserFacingError):
                raise exception
            if hasattr(exception, 'status'):
                self.response.status_int = exception.status
            else:
                self.response.status_int = 400
            self.response.body = json.dumps({
                'error': exception.message
            })

    if method:
        def wrapper(_, *args, **kwargs):
            result = getattr(Model, method)(*args, **kwargs)
            visible_fields = getattr(Model, 'VISIBLE_FIELDS', None)
            if hasattr(result, '__iter__'):
                items = (entity.to_dict(include=visible_fields) for entity in result)
                return {item[id_key]: item for item in items}
            else:
                return result.to_dict(include=visible_fields)

        ResourceHandler.index = wrapper
    else:
        ResourceHandler.index = default_index
        ResourceHandler.get = default_get
        ResourceHandler.put = default_put
        ResourceHandler.delete = default_delete

    restful_wrapper = restful_api('/application/json', custom_serializer=serializer_func)
    return restful_wrapper(ResourceHandler)


def ResourceRoutes(route_prefix, Model, **kwargs):
    handler = create_resource_handler(Model, **kwargs)
    return PathPrefixRoute('/{}'.format(route_prefix), [
            Route('/', handler=handler, handler_method='index', methods=['GET']),
            Route('/<uid:[^/]+>', handler=handler, methods=['GET', 'PUT', 'DELETE']),
        ])
