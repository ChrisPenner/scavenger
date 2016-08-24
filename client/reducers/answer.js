/* @flow */
import R from 'ramda'
import transform from '../lib/transform'

import at from '../action-types'
import { baseResourceReducer } from './common'
import { Answer, Clue } from '../resources'
import { phoneNumber } from '../lib/validators'

const validate = R.map(R.evolve({
  receiver: phoneNumber
}))

export default transform(
  validate,
  (answers: Object = {}, action: Object) => {
  const baseResult = baseResourceReducer(Answer.type, answers, action)
  if (baseResult !== undefined){
    return baseResult
  }
  const {payload, type} = action
  switch (type) {
      case at.DELETE_CLUE:
      const notEqualsClueUid = R.compose(R.not, R.equals(payload.uid), R.prop('clueUid'))
      return R.pickBy(notEqualsClueUid, answers)
    default:
      return answers
  }
})
