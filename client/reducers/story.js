/* @flow */
import { handleActions } from 'redux-actions'
import R from 'ramda'

import at from '../actions/types'
import commonReducer from './common'
import { Story, Clue } from '../resources'
import type { StoryType } from '../resources'
import { splitUid } from '../utils'

type StoryReducerT = {[id:string]: StoryType}

const transformClueUids = R.curry((fn, state, {payload}) => {
  const storyUid = splitUid(payload.uid).storyUid
  return R.evolve({
    [storyUid]: {
      clues: fn(payload)
    }
  }, state)
})

export const DEFAULT_STATE: StoryReducerT = {}

const reducer: (s: ?Object, a: Object) => StoryReducerT = commonReducer(Story,
  handleActions({
    [Clue.types.save]: (
      transformClueUids(({uid}) => R.compose(R.uniq, R.append(uid)))
    ),
    [Clue.types.create]: (
      transformClueUids(({uid}) => R.compose(R.uniq, R.append(uid)))
    ),
    [Clue.types.del]: (
      transformClueUids(({uid}) => R.without([uid]))
    ),
    [at.DROP_CLUE]: (
      transformClueUids(({index, uid}) => R.compose(R.insert(index, uid), R.without([uid])))
    ),
  }, DEFAULT_STATE)
)

export default reducer
