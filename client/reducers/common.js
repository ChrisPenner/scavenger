import * as at from 'action-types'

export const baseResourceReducer = (resourceType, state, action) => {
  switch (action.type) {
    case at.load(resourceType):
      return action.payload
    case at.change(resourceType):
      return R.assocPath(action.path, action.value, state)
    case at.set(resourceType):
      return R.assoc(action.payload.uid, action.payload, state)
    case at.del(resourceType):
      debugger
      return R.dissoc(action.payload.uid, state)
    default:
      return undefined
  }
}

