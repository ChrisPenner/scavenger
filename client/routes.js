/* @flow */
import { splitUid } from './utils'

export type routeT = Function

const STORY_ID_PARAM = ':storyId'
const CLUE_ID_PARAM = ':clueId'
const ANSWER_ID_PARAM = ':answerId'
const GROUP_UID_PARAM = ':groupUid'
const STORY_UID_PARAM = ':storyUid'

export const INDEX = ''

export const story: routeT = (uid: ?string) => `/stories/${uid || STORY_ID_PARAM}`
export const stories: routeT = () => `/stories/`
export const storycode: routeT = () => `/storycode/`

export const groups: routeT = () => `/groups/`

export const clue: routeT = (uid: ?string) => {
  if (uid) {
    const {clueId, storyId} = splitUid(uid)
    return `/stories/${storyId}/clues/${clueId}`
  }
  return `/stories/${STORY_ID_PARAM}/clues/${CLUE_ID_PARAM}`
}

export const answer: routeT = (uid: ?string) => {
  if (uid) {
    const {answerId, clueId, storyId} = splitUid(uid)
    return `/stories/${storyId}/clues/${clueId}/answers/${answerId}`
  }
  return `/stories/${STORY_ID_PARAM}/clues/${CLUE_ID_PARAM}/answers/${ANSWER_ID_PARAM}`
}
export const createStory: routeT = () => `/create-story`
export const createClue: routeT = (storyId: ?string) => `/stories/${storyId || STORY_ID_PARAM}/create-clue`
export const createAnswer: routeT = (storyId: ?string, clueId: ?string) => `/stories/${storyId || STORY_ID_PARAM}/clues/${clueId || CLUE_ID_PARAM}/create-answer`

export const explorer: routeT = () => `/explorer`
export const groupMessages: routeT = (groupUid) => groupUid ? `/messages/group/${groupUid}` : `/messages/group/${GROUP_UID_PARAM}`
export const storyMessages: routeT = (storyUid) => storyUid ? `/messages/story/${storyUid}` : `/messages/story/${STORY_UID_PARAM}`
export const messagesIndex: routeT = () => `/messages/index`
export const messages: routeT = () => `/messages`
