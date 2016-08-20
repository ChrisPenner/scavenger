/* @flow */
import R from 'ramda'

import * as at from '../action-types'

export const DEFAULT_STATE = {
  testMessage: ''
}
export default (data: Object = DEFAULT_STATE, action: Object) => {
  switch (action.type) {
    case at.CHANGE_TEST_MESSAGE:
      return R.assoc('testMessage', action.payload, data)
    default:
      return data
  }
}
