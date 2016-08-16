import * as at from 'action-types'
import { splitUid } from './'

export default (clues = {}, action) => {
  switch (action.type) {
    case at.LOAD_CLUES:
      return action.payload
    case at.CHANGE_CLUE:
      return R.assocPath(action.path, action.value, clues)
    case at.SET_CLUE:
      return R.assoc(action.payload.uid, action.payload, clues)
    case at.SET_ANSWER:
      const {clueUid} = splitUid(action.payload.uid)
      return R.evolve({
        [clueUid]: {
          answerUids: R.append(action.payload.uid)
        }
      }, clues)
    default:
      return clues
  }
}

