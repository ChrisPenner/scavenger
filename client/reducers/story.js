/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'

import at from '../action-types'
import commonReducer from './common'
import { Story, Clue } from '../resources'
import { splitUid } from '../utils'

export const DEFAULT_STATE = {}
export default commonReducer(Story.type,
  handleActions({
    [at.SET_CLUE]: (stories, {payload}) => {
      const storyUid = splitUid(payload.uid).storyUid
      return R.evolve({
        [storyUid]: {
          clues: R.compose(R.uniq, R.append(payload.uid))
        }
      }, stories)},
    [at.DELETE_CLUE]: (stories, {payload}) => {
      const storyUid = splitUid(payload.uid).storyUid
      return R.evolve({
        [storyUid]: {
          clues: R.without(payload.uid)
        }
      }, stories)
    },
  }, DEFAULT_STATE)
)
