/* @flow */
import { handleActions } from 'redux-actions'

import commonReducer from './common'
import { Message } from '../resources'

export const DEFAULT_STATE = {}
export default commonReducer(Message.type,
  handleActions({}, DEFAULT_STATE)
)
