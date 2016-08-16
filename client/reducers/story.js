import * as at from 'action-types'

export default (stories = {}, action) => {
  switch (action.type) {
    case at.LOAD_STORIES:
      return action.payload
    case at.CHANGE_STORY:
      return R.assocPath(action.path, action.value, stories)
    case at.SET_CLUE:
      const {storyUid} = splitUid(action.payload.uid)
      return R.evolve({
        [storyUid]: {
          clues: R.append(action.payload.uid)
        }
      }, stories)
    case at.SET_STORY:
      return R.assoc(action.payload.uid, action.payload, stories)
    default:
      return stories
  }
}

