import {combineReducers} from 'redux'
import {LOAD_STORIES, LOAD_CLUES, LOAD_ANSWERS, CHANGE_CLUE, CHANGE_ANSWER, CHANGE_STORY} from './actions'

const setter = (state, action) => {
    const item = state[action.id]
        return  {
            ...state,
            [action.id]: {
                ...item,
                [action.field]: action.value,
            }
        }
}


const stories = (stories={}, action) => {
    switch (action.type) {
        case LOAD_STORIES:
            return action.data
        case CHANGE_STORY:
            return setter(stories, action)
        default:
            return stories
    }
}

const clues = (clues={}, action) => {
    switch (action.type) {
        case LOAD_CLUES:
            if (action.key !== 'clues'){
                return clues
            }
            return action.data
        case CHANGE_CLUE:
            return setter(clues, action)
        default:
            return clues
    }
}

const answers = (answers={}, action) => {
    switch (action.type) {
        case LOAD_ANSWERS:
            if (action.key !== 'answers'){
                return answers
            }
            return action.data
        case CHANGE_ANSWER:
            return setter(answers, action)
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
