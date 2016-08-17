import * as at from 'action-types'
import { baseResourceReducer } from './common'
import { Story, Clue } from 'resources'
import { splitUid } from './'

export default (stories = {}, action) => {
  const baseResult = baseResourceReducer(Story.type, stories, action)
  if (baseResult !== undefined){
    return baseResult
  }
  switch (action.type) {
    case at.set(Clue.type):
      const {storyUid} = splitUid(action.payload.uid)
      return R.evolve({
        [storyUid]: {
          clues: R.append(action.payload.uid)
        }
      }, stories)
    default:
      return stories
  }
}

