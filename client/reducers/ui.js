import * as at from '../action-types'

export default (ui={dragData: null}, action) => {
  switch (action.type) {
    case at.START_DRAG:
      return R.assoc('dragData', action.payload, ui)
    case at.STOP_DRAG:
      return R.assoc('dragData', null, ui)
    default:
      return ui
  }
}

