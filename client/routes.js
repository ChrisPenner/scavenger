export { Routes as API } from 'api'
import {splitUid} from 'reducers'

const STORY_ID_PARAM = ':storyId'
const CLUE_ID_PARAM = ':clueId'
const ANSWER_ID_PARAM = ':answerId'


export default {
    story: (uid) => `/stories/${uid === undefined ? STORY_ID_PARAM : uid}`,
    clue: (uid) => {
        if (uid){
            const {clueId, storyId} = splitUid(uid)
            return `/stories/${storyId}/clues/${clueId}`
        }
        return `/stories/${STORY_ID_PARAM}/clues/${CLUE_ID_PARAM}`
    },
    answer: (uid) => {
        if (uid){
            const {answerId, clueId, storyId} = splitUid(uid)
            return `/stories/${storyId}/clues/${clueId}/answers/${answerId}`
        }
        return `/stories/${STORY_ID_PARAM}/clues/${CLUE_ID_PARAM}/answers/${ANSWER_ID_PARAM}`
    },
    createStory: () => `/create-story`,
    explorer: () => `/explorer`,
    message: () => `/api/message`,
}

export const INDEX = ''
export const CREATE = 'create'
