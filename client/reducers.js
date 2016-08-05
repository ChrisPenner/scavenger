import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import * as at from 'action-types'

const splitUid = (uid) => {
    const splitList = R.split(':', uid)
    const concatWithColon = (prev, next) => `${prev}:${next}`
    const uids = R.zipObj(['storyUid', 'clueUid', 'answerUid'], R.scan(concatWithColon, R.head(splitList), R.tail(splitList)))
    return uids
}

const stories = (stories={}, action) => {
    switch (action.type) {
        case at.LOAD_STORIES:
            return action.payload
        case at.CHANGE_STORY:
            return R.assocPath([action.uid, action.field], action.value, stories)
        case at.SET_CLUE:
            const { storyUid } = splitUid(action.payload.uid)
            return R.evolve({[storyUid]: {clues: R.append(action.payload.uid)}}, stories)
        case at.SET_STORY:
            return R.assoc(action.payload.uid, action.payload, stories)
        default:
            return stories
    }
}

const clues = (clues={}, action) => {
    switch (action.type) {
        case at.LOAD_CLUES:
            return action.payload
        case at.CHANGE_CLUE:
            return R.assocPath([action.uid, action.field], action.value, clues)
        case at.SET_CLUE:
            return R.assoc(action.payload.uid, action.payload, clues)
        case at.SET_ANSWER:
            const { clueUid } = splitUid(action.payload.uid)
            return R.evolve({[clueUid]: {answers: R.append(action.payload.uid)}}, clues)
        default:
            return clues
    }
}

const answers = (answers={}, action) => {
    switch (action.type) {
        case at.LOAD_ANSWERS:
            return action.payload
        case at.CHANGE_ANSWER:
            return R.assocPath([action.uid, action.field], action.value, answers)
        case at.SET_ANSWER:
            return R.assoc(action.payload.uid, action.payload, answers)
        default:
            return answers
    }
}

export default combineReducers({
    routing: routerReducer,
    stories,
    clues,
    answers,
})

const listFromMapping = (mapping) => Object.keys(mapping).map(key => mapping[key])

export const getClue = (state, clueUid) => state.clues[clueUid]
export const getClues = (state) => state.clues
export const getClueUidsByStory = (state, storyUid) => getStory(state, storyUid).clues
export const getCluesList = (state) => listFromMapping(state.clues)
export const getCluesByStory = (state, storyUid) => getCluesList(state).filter(({storyUid}) => storyUid === storyUid)
export const getCluesListByStory = (state, storyUid) => listFromMapping(getCluesByStory(state, storyUid))

export const getStory = (state, storyUid) => state.stories[storyUid]
export const getStories = (state) => state.stories
export const getStoriesList = (state) => listFromMapping(state.stories)

export const getAnswer = (state, answerUid) => state.answers[answerUid]
export const getAnswers = (state) => state.answers
export const getAnswersByClue = (state, clueUid) => getClue(state, clueUid).answers.map(answerUid=>getAnswer(state, answerUid))
export const getAnswersListByClue = (state, clueUid) => listFromMapping(getAnswersByClue(state, clueUid))
