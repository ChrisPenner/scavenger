/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'

import at from '../action-types'

export const DEFAULT_STATE = { testMessage: '' }
export default handleActions({
  [at.CHANGE_TEST_MESSAGE]: (state, {payload}) => R.assoc('testMessage', payload, state),
}, DEFAULT_STATE)
