/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'
import type { ResourceT } from '../resources'
import at from '../actions/types'

const baseResourceReducer = (resource: ResourceT) => handleActions({
  [at.fetch(resource.type)]: (
    (state, {payload}) => ({...state, ...payload})
  ),

  [at.change(resource.type)]: (
    (state, {payload: {path, value}}) => R.assocPath(path, value, state)
  ),

  [at.save(resource.type)]: (
    (state, {payload}) => R.assoc(payload.uid, payload, state)
  ),

  [at.create(resource.type)]: (
    (state, {payload}) => R.assoc(payload.uid, payload, state)
  ),

  [resource.types.saga.del]: (
    (state, {payload:{uid}}) => R.dissoc(uid, state)
  ),
})

export default (resource: ResourceT, reducer: Function) => (state: any, action: Object) => {
  const baseResult = baseResourceReducer(resource)(state, action)
  return reducer(baseResult, action)
}
