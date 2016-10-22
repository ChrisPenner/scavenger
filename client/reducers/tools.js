/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'

import at from '../actions/types'

export type ToolsState = { testMessage: string }
export const DEFAULT_STATE: ToolsState = { testMessage: '' }
export default handleActions({
  [at.CHANGE_TEST_MESSAGE]: (state, {payload}) => R.assoc('testMessage', payload, state),
}, DEFAULT_STATE)
