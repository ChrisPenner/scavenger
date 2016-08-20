/* @flow */
import R from 'ramda'

import * as at from '../action-types'

export default (ui: Object = {dragData: null}, action: Object) => {
  switch (action.type) {
    case at.START_DRAG:
      return R.assoc('dragData', action.payload, ui)
    case at.STOP_DRAG:
      return R.assoc('dragData', null, ui)
    default:
      return ui
  }
}

