/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'

import at from '../action-types'

const DEFAULT_STATE = {dragData: null}
export default handleActions({
  [at.START_DRAG]: (ui, {payload}) => R.assoc('dragData', payload, ui),
  [at.STOP_DRAG]: R.assoc('dragData', null),
}, DEFAULT_STATE)
