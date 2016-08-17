import * as at from 'action-types'
import { baseResourceReducer } from './common'
import { Answer } from 'resources'

export default (answers = {}, action) => {
  const baseResult = baseResourceReducer(Answer.type, answers, action)
  if (baseResult !== undefined){
    return baseResult
  }
  switch (action.type) {
    default:
      return answers
  }
}

