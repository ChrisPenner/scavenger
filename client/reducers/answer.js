/* @flow */
import R from 'ramda'
import transform from '../lib/transform'

import at from '../action-types'
import commonReducer from './common'
import { Answer, Clue } from '../resources'
import { phoneNumber } from '../lib/validators'

const validate = R.map(R.evolve({
  receiver: phoneNumber
}))

const DEFAULT_STATE = {}
export default transform(validate,
  commonReducer(Answer.type,
    (answers: Object = DEFAULT_STATE, action: Object) => {
      const {payload, type} = action
        switch (type) {
          case at.DELETE_CLUE:
            const notEqualsClueUid = R.compose(R.not, R.equals(payload.uid), R.prop('clueUid'))
            return R.pickBy(notEqualsClueUid, answers)
          default:
            return answers
        }
    }))
