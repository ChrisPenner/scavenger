import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import * as at from 'action-types'
import { Story, Clue, Answer } from 'resources'

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
        case at.LOAD_STORIES:
            return action.payload
        case at.CHANGE_STORY:
            return setter(stories, action)
        case at.ADD_STORY:
            return adder(stories, Story.new(action.payload))
        case at.SET_CLUE:
            const [story_id, _] = action.payload.uid.split(':')
            const story = stories[story_id]
            return {
                ...stories,
                [story_id]: {
                    ...story,
                    clues: [...story.clues, action.payload.uid],
                }
            }
        case at.SET_STORY:
            return {
                ...stories,
                [action.payload.uid]: action.payload
            }
        default:
            return stories
    }
}

const clues = (clues={}, action) => {
    switch (action.type) {
        case at.LOAD_CLUES:
            return action.payload
        case at.CHANGE_CLUE:
            return setter(clues, action)
        case at.ADD_CLUE:
            return adder(clues, Clue.new(action.payload))
        case at.ADD_ANSWER:
            const clue = clues[action.payload.clue_id]
            const {clue_id} = action.payload
            debugger
            return {
                ...clues,
                [clue_id]: {
                    ...clue,
                    answers: [...clue.answers, action.payload.uid],
                }
            }
        case at.SET_CLUE:
            return {
                ...clues,
                [action.payload.uid]: action.payload
            }
        default:
            return clues
    }
}

const answers = (answers={}, action) => {
    switch (action.type) {
        case at.LOAD_ANSWERS:
            return action.payload
        case at.CHANGE_ANSWER:
            return setter(answers, action)
        case at.ADD_ANSWER:
            return adder(answers, Answer.new(action.payload))
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
export const getAnswersByClue = (state, clueID) => getClue(state, clueID).answers.map(answerID=>getAnswer(state, answerID))
export const getAnswersListByClue = (state, clueID) => listFromMapping(getAnswersByClue(state, clueID))
