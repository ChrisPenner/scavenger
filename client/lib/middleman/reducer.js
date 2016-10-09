/* @flow */
import R from 'ramda'
import {IS_PENDING, NOT_PENDING, API_ERROR} from './constants'
import type {Config} from './'

const DEFAULT_STATE = {}
export default (state: Object = DEFAULT_STATE, action: Object) => {
  const info = R.path(['meta', 'middleman'], action)
  if(!info){
    return state
  }

  const {
    resource,
    status,
  } = info

  let nextState = state
  if (status === IS_PENDING){
    nextState = R.assocPath([resource, 'pending'], true, nextState)
  } else if (status === NOT_PENDING){
    nextState = R.assocPath([resource, 'pending'], false, nextState)
    nextState = R.assocPath([resource, 'initialized'], true, nextState)
  }
  return nextState
}
