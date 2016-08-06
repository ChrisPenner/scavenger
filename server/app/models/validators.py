def not_empty(prop, value):
    if not value:
        raise ValueError('{} must not be empty'.format(prop._name))
