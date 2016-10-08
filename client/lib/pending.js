/* @flow */
import R from 'ramda'
import { handleActions } from 'redux-actions'

export const IS_PENDING = '@pending/IS_PENDING'
export const NOT_PENDING = '@pending/NOT_PENDING'

const DEFAULT_STATE = {}
const reducer = handleActions({
  [IS_PENDING]: (state, { payload:resource }) => R.assoc(resource, true, state),
  [NOT_PENDING]: (state, { payload:resource }) => {
    debugger
    return R.assoc(resource, false, state)
  },
}, DEFAULT_STATE)

export default reducer
