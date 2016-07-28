import {combineReducers} from 'redux'
import {STORE_RESULTS} from './actions'
const stories = (stories={}, action) => {
    if (action.key !== 'stories'){
        return stories
    }
    switch (action.type) {
        case STORE_RESULTS:
            return action.data
        default:
            return stories
    }
}

const clues = (clues={}, action) => {
    if (action.key !== 'clues'){
        return clues
    }
    switch (action.type) {
        case STORE_RESULTS:
            return action.data
        default:
            return clues
    }
}

const answers = (answers={}, action) => {
    if (action.key !== 'answers'){
        return answers
    }
    switch (action.type) {
        case STORE_RESULTS:
            return action.data
        default:
            return answers
    }
}

export default combineReducers({
    stories,
    clues,
    answers,
})

const listFromMapping = (mapping) => Object.keys(mapping).map(key => mapping[key])

export const getClue = (state, clueID) => state.clues[clueID]
export const getClues = (state) => state.clues
export const getCluesList = (state) => listFromMapping(state.clues)
export const getCluesByStory = (state, storyID) => getCluesList(state).filter(({story_id}) => story_id === storyID)
export const getStory = (state, storyID) => state.stories[storyID]
export const getStories = (state) => state.stories
export const getStoriesList = (state) => listFromMapping(state.stories)
export const getAnswer = (state, answerID) => state.answers[answerID]
export const getAnswersByClue = (state, clueID) => getClue(state, clueID).answers.map(answerID=>getAnswer(state, answerID))
export const getAnswersListByClue = (state, clueID) => listFromMapping(getAnswersByClue(state, clueID))
