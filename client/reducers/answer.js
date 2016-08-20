/* @flow */
import R from 'ramda'

import * as at from '../action-types'
import { baseResourceReducer } from './common'
import { Answer, Clue } from '../resources'

export default (answers: Object = {}, action: Object) => {
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

