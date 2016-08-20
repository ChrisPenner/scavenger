import * as at from '../action-types'
import { baseResourceReducer } from './common'
import { Answer, Clue } from '../resources'

export default (answers = {}, action) => {
  const baseResult = baseResourceReducer(Answer.type, answers, action)
  if (baseResult !== undefined){
    return baseResult
  }
  switch (action.type) {
      case at.del(Clue.type):
        return R.pickBy(
          ({ clueUid }, key) => clueUid !== action.payload.uid,
          answers
        )
    default:
      return answers
  }
}

