import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import stories from './story'
import answers from './answer'
import clues from './clue'
import explorer from './explorer'
import ui from './ui'

export default combineReducers({
  routing: routerReducer,
  stories,
  clues,
  answers,
  explorer,
  ui,
})

const concatWithColon = (prev, next) => `${prev}:${next}`
export const splitUid = (uid) => {
  const splitList = R.split(':', uid)
  const ids = R.zipObj(['storyId', 'clueId', 'answerId'], splitList)
  const uids = R.zipObj(['storyUid', 'clueUid', 'answerUid'], R.scan(concatWithColon, R.head(splitList), R.tail(splitList)))
  return R.merge(ids, uids)
}

export const uidsFromParams = (params) => {
  const {storyId, clueId, answerId} = params
  const splitList = [storyId, clueId, answerId]
  const uids = R.zipObj(['storyUid', 'clueUid', 'answerUid'], R.scan(concatWithColon, R.head(splitList), R.tail(splitList)))
  return uids
}

const listFromMapping = (mapping) => Object.keys(mapping).map(key => mapping[key])

export const getClue = (state, clueUid) => state.clues[clueUid]
export const getClues = (state) => state.clues
export const getClueUidsByStory = (state, storyUid) => getStory(state, storyUid).clues
export const getCluesList = (state) => listFromMapping(state.clues)
export const getCluesByStory = (state, storyUid) => {
  const equalsStoryUid = R.compose(R.equals(storyUid), R.prop('storyUid'))
  return getCluesList(state).filter(equalsStoryUid)
}
export const getCluesListByStory = (state, storyUid) => listFromMapping(getCluesByStory(state, storyUid))

export const getStory = (state, storyUid) => state.stories[storyUid]
export const getStories = (state) => state.stories
export const getStoriesList = (state) => listFromMapping(state.stories)

export const getAnswer = (state, answerUid) => state.answers[answerUid]
export const getAnswers = (state) => state.answers
export const getAnswersByClue = (state, clueUid) => getClue(state, clueUid).answerUids.map(answerUid => getAnswer(state, answerUid))
export const getAnswersListByClue = (state, clueUid) => listFromMapping(getAnswersByClue(state, clueUid))

export const getExplorer = (state) => state.explorer

export const getDragData = (state) => state.ui.dragData
