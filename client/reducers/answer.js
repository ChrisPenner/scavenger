/* @flow */
import { handleActions } from 'redux-actions'
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
    handleActions({
      [at.DELETE_CLUE]: (state, {payload: {uid}}) => {
        const notEqualsClueUid = R.compose(R.not, R.equals(uid), R.prop('clueUid'))
        return R.pickBy(notEqualsClueUid, state)
      },
    })
  )
)
