/* @flow */
export const twilio = () => `/twilio`
import { splitUid } from './utils'
import {Story, Clue} from './resources'


export type routeT = string
export const CLUE_UID_PARAM = ':clueUid'
export const ANSWER_UID_PARAM = ':answerUid'
export const GROUP_UID_PARAM = ':groupUid'
export const STORY_UID_PARAM = ':storyUid'
export const INDEX = ''

export const createStory = ():routeT => `/create-story`
export const createClue = (storyUid: string):routeT => `${Story.route(storyUid)}/create-clue`
export const createAnswer = (clueUid: string):routeT => `${Clue.route(clueUid)}/create-answer`


export const groupMessages = (groupUid: string):routeT => `/messages/group/${groupUid}`
export const storyMessages = (storyUid: string):routeT => `/messages/story/${storyUid}`

export const explorer = ():routeT => `/explorer`
