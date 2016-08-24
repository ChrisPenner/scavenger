/* @flow */
import R from 'ramda'
import type { ResourceType } from '../resources'

const baseResourceReducer = R.curry((resourceType: ResourceType, state: any, action: Object) => {
  const { payload } = action
  switch (action.type) {
    case `LOAD_${resourceType}`:
      return payload
    case `CHANGE_${resourceType}`:
      return R.assocPath(payload.path, payload.value, state)
    case `SET_${resourceType}`:
      return R.assoc(payload.uid, payload, state)
    case `DELETE_${resourceType}`:
      return R.dissoc(payload.uid, state)
    default:
      return state
  }
})

export default (resourceType: string, reducer: Function) => (state: Object, action: Object) => {
  const baseResult = baseResourceReducer(resourceType, state, action)
  return reducer(baseResult, action)
}
