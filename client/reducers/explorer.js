import * as at from '../action-types'

export default (explorer = {
    text: '',
    toNumber: 'server',
    fromNumber: 'testing',
    texts: []
  } , action) => {
  switch (action.type) {
    case at.CHANGE_EXPLORER:
      return R.assocPath(action.path, action.value, explorer)
    case at.RECEIVE_MESSAGE:
    case at.SEND_MESSAGE:
      return R.evolve({
        texts: R.prepend(action.payload)
      })(explorer)
    default:
      return explorer
  }
}

