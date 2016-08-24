/* @flow */
import R from 'ramda'

import at from '../action-types'
import { baseResourceReducer } from './common'
import { Story, Clue } from '../resources'
import { splitUid } from './'

export default (stories: Object = {}, action: Object) => {
  const baseResult = baseResourceReducer(Story.type, stories, action)
  if (baseResult !== undefined){
    return baseResult
  }
  let storyUid
  switch (action.type) {
    case at.SET_CLUE:
      storyUid = splitUid(action.payload.uid).storyUid
      return R.evolve({
        [storyUid]: {
          clues: R.compose(R.uniq, R.append(action.payload.uid))
        }
      }, stories)
    case at.DELETE_CLUE:
      storyUid = splitUid(action.payload.uid).storyUid
      return R.evolve({
        [storyUid]: {
          clues: R.without(action.payload.uid)
        }
      }, stories)
    default:
      return stories
  }
}

