/* @flow */
import { handleActions } from 'redux-actions'

import commonReducer from './common'
import { StoryCode } from '../resources'

export const DEFAULT_STATE = {}
export default commonReducer(StoryCode.type,
  handleActions({}, DEFAULT_STATE)
)
