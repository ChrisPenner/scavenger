/* @flow */
import R from 'ramda'
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import stories from './story'
import answers from './answer'
import clues from './clue'
import explorer from './explorer'
import ui from './ui'
import tools from './tools'

export default combineReducers({
  routing: routerReducer,
  stories,
  clues,
  answers,
  explorer,
  tools,
  ui,
})

const concatWithColon = (prev, next) => `${prev}:${next}`
export const splitUid = (uid: string) => {
  const splitList = R.split(':', uid)
  const ids = R.zipObj(['storyId', 'clueId', 'answerId'], splitList)
  const uids = R.zipObj(['storyUid', 'clueUid', 'answerUid'], R.scan(concatWithColon, R.head(splitList), R.tail(splitList)))
  return R.merge(ids, uids)
}

export const uidsFromParams = (params: Object) => {
  const {storyId, clueId, answerId} = params
  const splitList = [storyId, clueId, answerId]
  const uids = R.zipObj(['storyUid', 'clueUid', 'answerUid'], R.scan(concatWithColon, R.head(splitList), R.tail(splitList)))
  return uids
}

const listFromMapping = (mapping: Object) => Object.keys(mapping).map(key => mapping[key])

export const getClue = (state: Object, clueUid: string) => state.clues[clueUid]
export const getClues = (state: Object) => state.clues
export const getClueUidsByStory = (state: Object, storyUid: string) => getStory(state, storyUid).clues
export const getCluesList = (state: Object) => listFromMapping(state.clues)
export const getCluesByStory = (state: Object, storyUid: string) => {
  const equalsStoryUid = R.compose(R.equals(storyUid), R.prop('storyUid'))
  return getCluesList(state).filter(equalsStoryUid)
}
export const getCluesListByStory = (state: Object, storyUid: string) => getCluesByStory(state, storyUid)

export const getStory = (state: Object, storyUid: string) => state.stories[storyUid]
export const getStories = (state: Object) => state.stories
export const getStoriesList = (state: Object) => listFromMapping(state.stories)

export const getAnswer = (state: Object, answerUid: string) => state.answers[answerUid]
export const getAnswers = (state: Object) => state.answers
export const getAnswersByClue = (state: Object, clueUid: string) => getClue(state, clueUid).answerUids.map(answerUid => getAnswer(state, answerUid))
export const getAnswersListByClue = (state: Object, clueUid: string) => listFromMapping(getAnswersByClue(state, clueUid))

export const getExplorer = (state: Object) => state.explorer
export const getToolData = (state: Object) => state.tools

export const getDragData = (state: Object) => state.ui.dragData
