/* @flow */
import R from 'ramda'

import * as at from '../action-types'
import { changeExplorer } from '../actions'

export default (explorer:Object = {
    text: '',
    receiver: 'server',
    sender: 'testing',
    texts: []
  } , action: Object) => {
  const { payload } = action
  switch (action.type) {
    case changeExplorer.toString():
      return R.assocPath(payload.path, payload.value, explorer)
    case at.RECEIVE_MESSAGE:
    case at.SEND_MESSAGE:
      return R.evolve({
        texts: R.prepend(action.payload)
      })(explorer)
    default:
      return explorer
  }
}

