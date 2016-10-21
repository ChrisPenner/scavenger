/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'
import transform from '../lib/transform'

import commonReducer from './common'
import { Answer, Clue } from '../resources'
import type { AnswerType } from '../resources'
import { phoneNumber } from '../lib/validators'

type AnswerReducerT = {[id:string]: AnswerType}

const validate = R.map(R.evolve({
  receiver: phoneNumber
}))

const DEFAULT_STATE: AnswerReducerT = {}

const reducer: (state: ?Object, action: Object) => AnswerReducerT = transform(validate,
  commonReducer(Answer,
    handleActions({
      [Clue.types.saga.del]: (state, {payload: {uid}}) => {
        const notEqualsClueUid = R.compose(R.not, R.equals(uid), R.prop('clueUid'))
        return R.pickBy(notEqualsClueUid, state)
      },
    }, DEFAULT_STATE)
  )
)

export default reducer
