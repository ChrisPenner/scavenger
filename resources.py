from flask_restful import Resource


class Todo(Resource):
    def get(self, todo_id):
        return 'hi'

    def delete(self, todo_id):
        return

    def put(self, todo_id):
        return


def register(api):
    # Actually setup the Api resource routing here
    api.add_resource(Todo, '/todos')
