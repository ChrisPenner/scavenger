/* @flow */
import R from 'ramda'

import * as at from '../action-types'

export default (explorer:Object = {
    text: '',
    receiver: 'server',
    sender: 'testing',
    texts: []
  } , action: Object) => {
  switch (action.type) {
    case at.CHANGE_EXPLORER:
      return R.assocPath(action.path, action.payload, explorer)
    case at.RECEIVE_MESSAGE:
    case at.SEND_MESSAGE:
      return R.evolve({
        texts: R.prepend(action.payload)
      })(explorer)
    default:
      return explorer
  }
}

