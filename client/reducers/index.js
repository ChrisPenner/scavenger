/* @flow */
import R from 'ramda'
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import stories from './story'
import clues from './clue'
import answers from './answer'
import groups from './group'
import messages from './message'
import at from '../action-types'
import { Story, Answer, Clue } from '../resources'
import explorer from './explorer'
import ui from './ui'
import tools from './tools'
import { loadedReducer } from '../lib/loaded'
import { wispReducer } from '../lib/wisp'

export default combineReducers({
  routing: routerReducer,
  stories,
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

const listFromMapping = (mapping: Object) => Object.keys(mapping).map(key => mapping[key])

export const getClue = (state: Object, clueUid: string) => state.clues[clueUid]
export const getClues = (state: Object) => state.clues
export const getClueUidsByStory = (state: Object, storyUid: string) => getStory(state, storyUid).clues
export const getCluesList = (state: Object) => listFromMapping(state.clues)
export const getCluesByStory = (state: Object, storyUid: string) => {
  return getClueUidsByStory(state, storyUid).map(clueUid => getClue(state, clueUid))
}

export const getCluesListByStory = (state: Object, storyUid: string) => getCluesByStory(state, storyUid)

export const getStory = (state: Object, storyUid: string) => state.stories[storyUid]
export const getStories = (state: Object) => state.stories
export const getStoriesList = (state: Object) => listFromMapping(state.stories)
export const getStoryUids = (state: Object) => R.keys(getStories(state))

export const getGroups = (state: Object) => state.groups
export const getGroupsList = (state: Object) => R.sortBy(R.prop("createdAt"), listFromMapping(state.groups))
export const getGroupUids = (state: Object) => R.keys(getGroups(state))

export const getAnswer = (state: Object, answerUid: string) => state.answers[answerUid]
export const getAnswers = (state: Object) => state.answers
export const getAnswersByClue = (state: Object, clueUid: string) => getClue(state, clueUid).answerUids.map(answerUid => getAnswer(state, answerUid))
export const getAnswersListByClue = (state: Object, clueUid: string) => listFromMapping(getAnswersByClue(state, clueUid))

export const getMessages = (state:Object) => state.messages
export const getMessagesByGroup = (state:Object, groupUid:string) => {
  const isFromGroup = R.compose(R.equals(groupUid), R.prop('groupUid'))
  return R.pickBy(isFromGroup, getMessages(state))
}
export const getMessagesByStory = (state:Object, storyUid:string) => {
  const isFromStory = R.compose(R.equals(storyUid), R.prop('storyUid'))
  return R.pickBy(isFromStory, getMessages(state))
}

export const getExplorer = (state: Object) => state.explorer
export const getToolData = (state: Object) => state.tools

export const getDragData = (state: Object) => state.ui.dragData

export const isLoaded = ({loaded}: Object) => (loaded[at.load(Story.type)] && loaded[at.load(Clue.type)] && loaded[at.load(Answer.type)])
