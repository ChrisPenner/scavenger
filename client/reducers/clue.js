/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'
import transform from '../lib/transform'

import at from '../action-types'
import { splitUid } from '../utils'
import { Clue, Answer } from '../resources'
import commonReducer from './common'
import { phoneNumber } from '../lib/validators'

const validate = R.map(R.evolve({
  sender: phoneNumber
}))

const transformAnswerUids = R.curry((fn, state, {payload}) => {
  const {uid} = payload
  const clueUid = splitUid(uid).clueUid
  return R.evolve({
    [clueUid]: {
      answerUids: fn(payload)
    }
  }, state)
})

const DEFAULT_STATE = {}
export default transform(validate,
  commonReducer(Clue.type,
    handleActions({
      [at.set(Answer.type)]: (
        transformAnswerUids(({uid}) => R.compose(R.uniq, R.append(uid)))
      ),

      [at.del(Answer.type)]: (
        transformAnswerUids(({uid}) => R.without([uid]))
    ),

      [at.DROP_ANSWER]: (
        transformAnswerUids(({index, uid}) => R.compose(R.insert(index, uid), R.without([uid])))
      ),
    }, DEFAULT_STATE)
  )
)
