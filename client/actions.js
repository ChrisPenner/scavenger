import * as Res from './resources.js'
import {getClue} from './reducers.js'

const fetchResource = (Resource, actionType) => (dispatch) => {
    return Resource.index()
                .then(json => dispatch({
                    type: actionType,
                    data: json,
                }))
}

const setter = (type) => (id) => (field, value) => ({
    type: type,
    id,
    field,
    value,
})

const saveResource = (Resource, actionType, getCurrentState) => (id) => (_) => (dispatch, getState) => {
    console.log(dispatch, getState)
    const currentState = getCurrentState(getState(), id)
    return Resource.put(id, currentState)
                .then(json=>console.log(json))
                .catch(err=>console.log(err))
}

export const LOAD_CLUES = 'LOAD_CLUES'
export const LOAD_STORIES = 'LOAD_STORIES'
export const LOAD_ANSWERS = 'LOAD_ANSWERS'

export const CHANGE_STORY = 'CHANGE_STORY'
export const CHANGE_CLUE = 'CHANGE_CLUE'
export const CHANGE_ANSWER = 'CHANGE_ANSWER'

export const SAVE_STORY = 'SAVE_STORY'
export const SAVE_CLUE = 'SAVE_CLUE'
export const SAVE_ANSWER = 'SAVE_ANSWER'

export const changeStory = setter(CHANGE_STORY)
export const changeClue = setter(CHANGE_CLUE)
export const changeAnswer = setter(CHANGE_ANSWER)

export const loadStories = fetchResource(Res.Story, LOAD_STORIES)
export const loadClues = fetchResource(Res.Clue, LOAD_CLUES)
export const loadAnswers = fetchResource(Res.Answer, LOAD_ANSWERS)

export const saveClue = saveResource(Res.Clue, SAVE_CLUE, getClue)
