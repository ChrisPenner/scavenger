import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import * as at from 'action-types'
import { Story, Clue, Answer } from 'resources'

const splitUID = R.compose(R.zipObj(['storyID', 'clueID', 'answerID']), R.split(':'))

const stories = (stories={}, action) => {
    switch (action.type) {
        case at.LOAD_STORIES:
            return action.payload
        case at.CHANGE_STORY:
            return R.assocPath([action.uid, action.field], action.value, stories)
        case at.SET_CLUE:
            const { storyID } = splitUID(action.payload.uid)
            return R.evolve({[storyID]: {clues: R.append(action.payload.uid)}}, stories)
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
            const { storyID, clueID } = splitUID(action.payload.uid)
            const clueUID = R.join(':', [storyID, clueID])
            return R.evolve({[clueUID]: {answers: R.append(action.payload.uid)}}, clues)
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

export const getClue = (state, clueID) => state.clues[clueID]
export const getClues = (state) => state.clues
export const getCluesList = (state) => listFromMapping(state.clues)
export const getCluesByStory = (state, storyID) => getCluesList(state).filter(({story_id}) => story_id === storyID)
export const getCluesListByStory = (state, storyID) => listFromMapping(getCluesByStory(state, storyID))

export const getStory = (state, storyID) => state.stories[storyID]
export const getStories = (state) => state.stories
export const getStoriesList = (state) => listFromMapping(state.stories)

export const getAnswer = (state, answerID) => state.answers[answerID]
export const getAnswers = (state) => state.answers
export const getAnswersByClue = (state, clueID) => getClue(state, clueID).answers.map(answerID=>getAnswer(state, answerID))
export const getAnswersListByClue = (state, clueID) => listFromMapping(getAnswersByClue(state, clueID))
