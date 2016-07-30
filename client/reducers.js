import {combineReducers} from 'redux'
import {
    LOAD_STORIES, LOAD_CLUES, LOAD_ANSWERS,
    CHANGE_STORY, CHANGE_CLUE, CHANGE_ANSWER,
    ADD_STORY, ADD_CLUE, ADD_ANSWER,
} from './actions'
import { Story, Clue, Answer } from './resources'

const setter = (state, action) => {
    const item = state[action.uid]
    return  {
        ...state,
        [action.uid]: {
            ...item,
            [action.field]: action.value,
        }
    }
}

const adder = (state, newItem) => {
    return {
        ...state,
        [newItem.uid]: newItem,
    }
}

const stories = (stories={}, action) => {
    switch (action.type) {
        case LOAD_STORIES:
            return action.data
        case CHANGE_STORY:
            return setter(stories, action)
        case ADD_STORY:
            return adder(stories, Story.new(action.data))
        case ADD_CLUE:
            const story = stories[action.data.story_id]
            const {story_id} = action.data
            return {
                ...stories,
                [action.data.story_id]: {
                    ...story,
                    clues: [...story.clues, action.data.uid],
                }
            }
        default:
            return stories
    }
}

const clues = (clues={}, action) => {
    switch (action.type) {
        case LOAD_CLUES:
            return action.data
        case CHANGE_CLUE:
            return setter(clues, action)
        case ADD_CLUE:
            return adder(clues, Clue.new(action.data))
        default:
            return clues
    }
}

const answers = (answers={}, action) => {
    switch (action.type) {
        case LOAD_ANSWERS:
            return action.data
        case CHANGE_ANSWER:
            return setter(answers, action)
        case ADD_ANSWER:
            return adder(answers, Answer.new(action.data))
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
export const getCluesListByStory = (state, storyID) => listFromMapping(getCluesByStory(state, storyID))

export const getStory = (state, storyID) => state.stories[storyID]
export const getStories = (state) => state.stories
export const getStoriesList = (state) => listFromMapping(state.stories)

export const getAnswer = (state, answerID) => state.answers[answerID]
export const getAnswersByClue = (state, clueID) => getClue(state, clueID).answers.map(answerID=>getAnswer(state, answerID))
export const getAnswersListByClue = (state, clueID) => listFromMapping(getAnswersByClue(state, clueID))
