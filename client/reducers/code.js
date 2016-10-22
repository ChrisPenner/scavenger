/* @flow */
import { handleActions } from 'redux-actions'

import commonReducer from './common'
import { Code } from '../resources'
import type { CodeType } from '../resources'

export type CodeState = {[uid:string]: CodeType}
export const DEFAULT_STATE: CodeState = {}

export default commonReducer(Code,
  handleActions({}, DEFAULT_STATE)
)
