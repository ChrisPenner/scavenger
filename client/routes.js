/* @flow */
import { splitUid } from './reducers'

const STORY_ID_PARAM = ':storyId'
const CLUE_ID_PARAM = ':clueId'
const ANSWER_ID_PARAM = ':answerId'

export const INDEX = ''

export default {
  story: (uid: ?string) => `/stories/${uid || STORY_ID_PARAM}`,
  stories: () => `/stories/`,
  clue: (uid: ?string) => {
    if (uid) {
      const {clueId, storyId} = splitUid(uid)
      return `/stories/${storyId}/clues/${clueId}`
    }
    return `/stories/${STORY_ID_PARAM}/clues/${CLUE_ID_PARAM}`
  },
  answer: (uid: ?string) => {
    if (uid) {
      const {answerId, clueId, storyId} = splitUid(uid)
      return `/stories/${storyId}/clues/${clueId}/answers/${answerId}`
    }
    return `/stories/${STORY_ID_PARAM}/clues/${CLUE_ID_PARAM}/answers/${ANSWER_ID_PARAM}`
  },
  createStory: () => `/create-story`,
  createClue: (storyId: ?string) => `/stories/${storyId || STORY_ID_PARAM}/create-clue`,
  createAnswer: (storyId: ?string, clueId: ?string) => `/stories/${storyId || STORY_ID_PARAM}/clues/${clueId || CLUE_ID_PARAM}/create-answer`,
  explorer: () => `/explorer`,
  message: () => `/api/message`,
}
