/* @flow */
import { handleActions } from 'redux-actions'

import commonReducer from './common'
import { Message } from '../resources'
import type { MessageType } from '../resources'

export type MessageState = {[uid:string]:MessageType}
export const DEFAULT_STATE: MessageState = {}

export default commonReducer(Message,
  handleActions({}, DEFAULT_STATE)
)
