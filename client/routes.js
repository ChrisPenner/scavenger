/* @flow */
export const twilio = () => `/twilio`
import { splitUid } from './utils'
import {Story, Clue} from './resources'

export type routeT = Function
export const CLUE_UID_PARAM = ':clueUid'
export const ANSWER_UID_PARAM = ':answerUid'
export const GROUP_UID_PARAM = ':groupUid'
export const STORY_UID_PARAM = ':storyUid'
export const INDEX = ''

export const createStory: routeT = () => `/create-story`
export const createClue: routeT = (storyUid: string) => `${Story.route(storyUid)}/create-clue`
export const createAnswer: routeT = (clueUid: string) => `${Clue.route(clueUid)}/create-answer`


export const groupMessages: routeT = (groupUid: string) => `/messages/group/${groupUid}`
export const storyMessages: routeT = (storyUid: string) => `/messages/story/${storyUid}`

export const explorer: routeT = () => `/explorer`
