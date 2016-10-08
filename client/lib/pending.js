/* @flow */
import R from 'ramda'
import { handleActions } from 'redux-actions'

export const IS_PENDING = '@pending/IS_PENDING'
export const NOT_PENDING = '@pending/NOT_PENDING'

const DEFAULT_STATE = {}
const reducer = handleActions({
  [IS_PENDING]: (state, { payload:resource }) => {
    const existing = state[resource] || {
      initialized: false,
    }
    const newResourceState = R.assoc('pending', true, existing)
    return R.assoc(resource, newResourceState, state)
  },
  [NOT_PENDING]: (state, { payload:resource }) => {
    const existing = state[resource] || {}
    const newResourceState = R.compose(
      R.assoc('pending', false),
      R.assoc('initialized', true)
    )(existing)
    return R.assoc(resource, newResourceState, state)
  }
}, DEFAULT_STATE)

export default reducer
