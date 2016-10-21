/* @flow */
import { handleActions } from 'redux-actions'

import commonReducer from './common'
import { Group } from '../resources'

export const DEFAULT_STATE = {}
export default commonReducer(Group,
  handleActions({}, DEFAULT_STATE)
)
