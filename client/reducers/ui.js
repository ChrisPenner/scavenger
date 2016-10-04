/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'

import at from '../action-types'

type UIReducerType = {
  dragData: any
}

const DEFAULT_STATE: UIReducerType = {dragData: null}

const reducer: (s: ?Object, a: Object) => UIReducerType = handleActions({
  [at.START_DRAG]: (ui, {payload}) => R.assoc('dragData', payload, ui),
  [at.STOP_DRAG]: R.assoc('dragData', null),
}, DEFAULT_STATE)

export default reducer
