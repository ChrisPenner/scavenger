/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'

import at from '../actions/types'

export type UIState = {
  dragData: any
}

const DEFAULT_STATE: UIState = {dragData: null}

const reducer: (s: ?Object, a: Object) => UIState = handleActions({
  [at.START_DRAG]: (ui, {payload}) => R.assoc('dragData', payload, ui),
  [at.STOP_DRAG]: R.assoc('dragData', null),
}, DEFAULT_STATE)

export default reducer
