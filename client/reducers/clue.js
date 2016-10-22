/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'
import transform from '../lib/transform'

import at from '../actions/types'
import { splitUid } from '../utils'
import { Clue, Answer, Story } from '../resources'
import type { ClueType } from '../resources'
import commonReducer from './common'
import { phoneNumber } from '../lib/validators'

type ClueReducerT = {[id:string]: ClueType}

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

const DEFAULT_STATE: ClueReducerT = {}

const reducer: (state: ?Object, action: Object) => ClueReducerT = transform(validate,
  commonReducer(Clue,
    handleActions({
      [Answer.types.save]: (
        transformAnswerUids(({uid}) => R.compose(R.uniq, R.append(uid)))
      ),

      [Answer.types.del]: (
        transformAnswerUids(({uid}) => R.without([uid]))
      ),

      [at.DROP_ANSWER]: (
        transformAnswerUids(({index, uid}) => R.compose(R.insert(index, uid), R.without([uid])))
      ),

      [Story.types.del]: (state, {payload: {uid}}) => {
        const notEqualsStoryUid = R.compose(R.not, R.equals(uid), R.prop('storyUid'))
        return R.pickBy(notEqualsStoryUid, state)
      },
    }, DEFAULT_STATE)
  )
)

export default reducer
