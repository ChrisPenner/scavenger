/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'
import type { ResourceT } from '../resources'

const baseResourceReducer = (resource: ResourceT) => handleActions({
  [resource.types.fetch]: (
    (state, {payload}) => ({...state, ...payload})
  ),

  [resource.types.change]: (
    (state, {payload: {path, value}}) => R.assocPath(path, value, state)
  ),

  [resource.types.save]: (
    (state, {payload}) => R.assoc(payload.uid, payload, state)
  ),

  [resource.types.create]: (
    (state, {payload}) => R.assoc(payload.uid, payload, state)
  ),

  [resource.types.del]: (
    (state, {payload:{uid}}) => R.dissoc(uid, state)
  ),
})

export default (resource: ResourceT, reducer: Function) => (state: any, action: Object) => {
  const baseResult = baseResourceReducer(resource)(state, action)
  return reducer(baseResult, action)
}
