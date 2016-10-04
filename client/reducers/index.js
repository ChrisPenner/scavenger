/* @flow */
import R from 'ramda'
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import stories from './story'
import codes from './code'
import clues from './clue'
import answers from './answer'
import groups from './group'
import messages from './message'
import at from '../action-types'
import { Story, Answer, Clue } from '../resources'
import type { StoryType, ClueType, AnswerType, GroupType, MessageType } from '../resources'
import explorer from './explorer'
import ui from './ui'
import tools from './tools'
import { loadedReducer } from '../lib/loaded'
import { wispReducer } from '../lib/wisp'

import type { ExplorerType } from './explorer'
import type { ToolsType } from './tools'

export default combineReducers({
  routing: routerReducer,
  stories,
  codes,
  clues,
  answers,
  explorer,
  groups,
  messages,
  tools,
  ui,
  loaded: loadedReducer,
  toasts: wispReducer,
})

type MapOf<T> = {[uid:string]: T}
function listFromMapping<T> (mapping: MapOf<T>): Array<T> {
  return Object.keys(mapping).map(key => mapping[key])
}

export const getClue = (state: Object, clueUid: string): ClueType => state.clues[clueUid]
export const getClues = (state: Object): MapOf<ClueType> => state.clues
export const getClueUidsByStory = (state: Object, storyUid: string): Array<string> => getStory(state, storyUid).clues
export const getCluesList = (state: Object): Array<ClueType> => listFromMapping(state.clues)
export const getCluesByStory = (state: Object, storyUid: string): Array<ClueType> => {
  return getClueUidsByStory(state, storyUid).map(clueUid => getClue(state, clueUid))
}

export const getStory = (state: Object, storyUid: string): StoryType => state.stories[storyUid]
export const getStories = (state: Object): MapOf<StoryType> => state.stories
export const getStoriesList = (state: Object): Array<StoryType> => listFromMapping(state.stories)
export const getStoryUids = (state: Object): Array<string> => R.keys(getStories(state))

export const getCodesList = (state: Object): Array<string> => listFromMapping(state.codes)

export const getGroupsList = (state: Object): Array<GroupType> => R.sortBy(R.prop("createdAt"), listFromMapping(state.groups))

export const getAnswer = R.curry((state: Object, answerUid: string) => state.answers[answerUid])
export const getAnswers = (state: Object): MapOf<AnswerType> => state.answers
export const getAnswersByClue = (state: Object, clueUid: string): Array<AnswerType> => {
  return getClue(state, clueUid).answerUids.map(getAnswer(state))
}
export const getAnswersListByClue = (state: Object, clueUid: string): Array<AnswerType> => {
  return getAnswersByClue(state, clueUid)
}

export const getMessages = (state:Object): MapOf<MessageType> => state.messages

export const byDateDescending = R.comparator((d1, d2) => d1.sent > d2.sent)

export const getGroupMessages = (state: Object, groupUid: string): Array<MessageType> => {
  const isFromGroup = R.compose(R.equals(groupUid), R.prop('groupUid'))
  return R.compose(
    R.sort(byDateDescending),
    R.values,
    R.pickBy(isFromGroup),
    getMessages
  )(state)
}

export const getStoryMessages = (state: Object, storyUid: string): Array<MessageType> => {
  const isFromStory = R.compose(R.equals(storyUid), R.prop('storyUid'))
  return R.compose(
    R.sort(byDateDescending),
    R.values,
    R.pickBy(isFromStory),
    getMessages
  )(state)
}

export const getExplorer = (state: Object): ExplorerType => state.explorer

export const getToolData = (state: Object): ToolsType => state.tools

export const getDragData = (state: Object): mixed => state.ui.dragData

export const isLoaded = ({loaded}: Object): boolean => (loaded[at.load(Story.type)] && loaded[at.load(Clue.type)] && loaded[at.load(Answer.type)])
