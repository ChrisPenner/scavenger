/* @flow */
import * as at from '../action-types'
import R from 'ramda'
import type { ResourceType } from '../resources'

export const baseResourceReducer = R.curry((resourceType: ResourceType, state: any, action: Object) => {
  const { payload } = action
  switch (action.type) {
    case at.load(resourceType):
      return payload
    case at.change(resourceType):
      return R.assocPath(payload.path, payload.value, state)
    case at.set(resourceType):
      return R.assoc(payload.uid, payload, state)
    case at.del(resourceType):
      return R.dissoc(payload.uid, state)
    default:
      return undefined
  }
})

