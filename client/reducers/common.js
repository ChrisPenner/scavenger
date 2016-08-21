/* @flow */
import * as at from '../action-types'
import R from 'ramda'
import type { ResourceType } from '../resources'

export const baseResourceReducer = R.curry((resourceType: ResourceType, state: any, action: Object) => {
  switch (action.type) {
    case at.load(resourceType):
      return action.payload
    case at.change(resourceType):
      return R.assocPath(action.path, action.payload, state)
    case at.set(resourceType):
      return R.assoc(action.payload.uid, action.payload, state)
    case at.del(resourceType):
      return R.dissoc(action.payload.uid, state)
    default:
      return undefined
  }
})

