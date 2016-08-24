/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'

import at from '../action-types'

const DEFAULT_STATE = {
  text: '',
  receiver: 'server',
  sender: 'testing',
  texts: []
}

const addMessage = (state, {payload}) => R.evolve({ texts: R.prepend(payload)}, state)

export default handleActions({
  [at.CHANGE_EXPLORER]: (state, {payload: {path, value}}) => (
    R.assocPath(path, value, state)
  ),
    [at.RECEIVE_MESSAGE]: addMessage,
    [at.SEND_MESSAGE]: addMessage,
}, DEFAULT_STATE)
