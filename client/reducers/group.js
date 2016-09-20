/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'

import at from '../action-types'
import commonReducer from './common'
import { Group } from '../resources'
import { splitUid } from '../utils'

export const DEFAULT_STATE = {}
export default commonReducer(Group.type,
  handleActions({}, DEFAULT_STATE)
)
