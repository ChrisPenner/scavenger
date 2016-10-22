/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'
import transform from '../lib/transform'

import commonReducer from './common'
import { Answer, Clue, Story } from '../resources'
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
      [Clue.types.del]: (state, {payload: {uid}}) => {
        const notEqualsClueUid = R.compose(R.not, R.equals(uid), R.prop('clueUid'))
        return R.pickBy(notEqualsClueUid, state)
      },
      [Story.types.del]: (state, {payload: {uid}}) => {
        const notEqualsStoryUid = R.compose(R.not, R.equals(uid), R.prop('storyUid'))
        return R.pickBy(notEqualsStoryUid, state)
      },
    }, DEFAULT_STATE)
  )
)

export default reducer
