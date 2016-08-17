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
  switch (action.type) {
    case at.set(Answer.type):
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

