from webapp2_extensions import UserFacingError
def not_empty(prop, value):
    if not value:
        raise UserFacingError('{} must not be empty'.format(prop._name))
