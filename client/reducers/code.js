/* @flow */
import { handleActions } from 'redux-actions'

import commonReducer from './common'
import { Code } from '../resources'

export const DEFAULT_STATE = {}
export default commonReducer(Code.type,
  handleActions({}, DEFAULT_STATE)
)
