/* @flow */
import R from 'ramda'
import {IS_PENDING, NOT_PENDING, API_ERROR} from './constants'
import type {Config} from './'

const DEFAULT_STATE = {}
export default (actions: Config) => (state: Object = DEFAULT_STATE, action: Object) => {
  if(!R.has(action.type, actions) && action.type !== API_ERROR){
    return state
  }

  const {
    meta: {
      middleman: {
        resource,
        status,
      },
    },
  } = action

  let nextState = R.assocPath([resource, 'initialized'], true, state)
  if (status === IS_PENDING){
    nextState = R.assocPath([resource, 'pending'], true, nextState)
  } else if (status === NOT_PENDING){
    nextState = R.assocPath([resource, 'pending'], false, nextState)
  }
  return nextState
}
