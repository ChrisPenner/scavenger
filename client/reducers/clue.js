import * as at from 'action-types'
import { splitUid } from './'
import { Clue, Answer } from 'resources'
import { baseResourceReducer } from './common'

export default (clues = {}, action) => {
  const baseResult = baseResourceReducer(Clue.type, clues, action)
  debugger
  if (baseResult !== undefined){
    return baseResult
  }
  let clueUid
  switch (action.type) {
    case at.set(Answer.type):
      clueUid = splitUid(action.payload.uid).clueUid
      return R.evolve({
        [clueUid]: {
          answerUids: R.append(action.payload.uid)
        }
      }, clues)
    case at.del(Answer.type):
      clueUid = splitUid(action.payload.uid).clueUid
      return R.evolve({
        [clueUid]: {
          answerUids: R.without(action.payload.uid)
        }
      }, clues)
    default:
      return clues
  }
}

