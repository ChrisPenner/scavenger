/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'
import type { ResourceType } from '../resources'

const baseResourceReducer = (resourceType: ResourceType) => handleActions({
  [`LOAD_${resourceType}`]: (
    (state, {payload}) => payload
  ),

  [`CHANGE_${resourceType}`]: (
    (state, {payload: {path, value}}) => R.assocPath(path, value, state)
  ),

  [`SET_${resourceType}`]: (
    (state, {payload}) => R.assoc(payload.uid, payload, state)
  ),

  [`DELETE_${resourceType}`]: (
    (state, {payload:{uid}}) => R.dissoc(uid, state)
  ),
})

export default (resourceType: ResourceType, reducer: Function) => (state: Object, action: Object) => {
  const baseResult = baseResourceReducer(resourceType)(state, action)
  return reducer(baseResult, action)
}
