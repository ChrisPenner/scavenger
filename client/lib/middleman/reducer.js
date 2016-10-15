/* @flow */
import R from 'ramda'
import {IS_PENDING, NOT_PENDING, API_ERROR} from './constants'

type MiddlemanState = {
  extensions: Object,
}
const DEFAULT_STATE = {
  extensions: {},
}
export default (state: MiddlemanState = DEFAULT_STATE, action: Object) => {
  const info: Object = R.path(['meta', 'middleman'], action)
  if(!info){
    return state
  }

  const {
    resource,
    status,
    extensions={},
  } = info

  let nextState = state
  if (status === IS_PENDING){
    nextState = R.assocPath([resource, 'pending'], true, nextState)
  } else if (status === NOT_PENDING){
    nextState = R.assocPath([resource, 'pending'], false, nextState)
    nextState = R.assocPath([resource, 'initialized'], true, nextState)
  }
  const mergedExtensionState = R.mergeWith(R.merge, state.extensions, extensions)
  nextState = R.assoc('extensions', mergedExtensionState, nextState)
  return nextState
}
