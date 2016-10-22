/* @flow */
import { handleActions } from 'redux-actions'

import commonReducer from './common'
import { Group } from '../resources'
import type { GroupType } from '../resources'

export type GroupState = {[uid:string]: GroupType}
export const DEFAULT_STATE: GroupState = {}

export default commonReducer(Group,
  handleActions({}, DEFAULT_STATE)
)
