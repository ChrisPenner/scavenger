import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import * as at from 'action-types'

const splitUid = (uid) => {
    const splitList = R.split(':', uid)
    const concatWithColon = (prev, next) => `${prev}:${next}`
    const ids = R.zipObj(['storyId', 'clueId', 'answerId'], splitList)
    const uids = R.zipObj(['storyUid', 'clueUid', 'answerUid'], R.scan(concatWithColon, splitList))
    return R.merge(ids, uids)
}

const stories = (stories={}, action) => {
    switch (action.type) {
        case at.LOAD_STORIES:
            return action.payload
        case at.CHANGE_STORY:
            return R.assocPath([action.uid, action.field], action.value, stories)
        case at.SET_CLUE:
            const { storyId } = splitUid(action.payload.uid)
            return R.evolve({[storyId]: {clues: R.append(action.payload.uid)}}, stories)
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
            const { storyId, clueId } = splitUid(action.payload.uid)
            const clueUid = R.join(':', [storyId, clueId])
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

export const getClue = (state, clueId) => state.clues[clueId]
export const getClues = (state) => state.clues
export const getCluesList = (state) => listFromMapping(state.clues)
export const getCluesByStory = (state, storyId) => getCluesList(state).filter(({storyId}) => storyId === storyId)
export const getCluesListByStory = (state, storyId) => listFromMapping(getCluesByStory(state, storyId))

export const getStory = (state, storyId) => state.stories[storyId]
export const getStories = (state) => state.stories
export const getStoriesList = (state) => listFromMapping(state.stories)

export const getAnswer = (state, answerId) => state.answers[answerId]
export const getAnswers = (state) => state.answers
export const getAnswersByClue = (state, clueId) => getClue(state, clueId).answers.map(answerId=>getAnswer(state, answerId))
export const getAnswersListByClue = (state, clueId) => listFromMapping(getAnswersByClue(state, clueId))
