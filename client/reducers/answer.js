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
  const {payload, type} = action
  switch (type) {
      case at.del(Clue.type):
      const notEqualsClueUid = R.compose(R.not, R.equals(payload.uid), R.prop('clueUid'))
      return R.pickBy(notEqualsClueUid, answers)
    default:
      return answers
  }
}

