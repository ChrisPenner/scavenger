/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'

export default handleActions({
  START_DRAG: (ui, {payload}) => R.assoc('dragData', payload, ui),
  STOP_DRAG: (ui, other) => R.assoc('dragData', null, ui),
}, {dragData: null})
