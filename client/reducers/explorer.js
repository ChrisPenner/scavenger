/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'

import at from '../actions/types'

import type { MessageType } from '../resources'

export type ExplorerState = {
  text: string,
  receiver: string,
  sender: string,
  mediaUrl: '',
  texts: Array<MessageType>
}
const DEFAULT_STATE: ExplorerState = {
  text: '',
  receiver: 'server',
  sender: 'testing',
  mediaUrl: '',
  texts: []
}

const addMessage = (state, {payload}) => R.evolve({ texts: R.prepend(payload)}, state)

const reducer: (s: ?Object, a: Object) => ExplorerState = handleActions({
  [at.CHANGE_EXPLORER]: (state, {payload: {path, value}}) => (
    R.assocPath(path, value, state)
  ),
  [at.RECEIVE_MESSAGE]: addMessage,
  [at.SEND_MESSAGE]: addMessage,
}, DEFAULT_STATE)

export default reducer
