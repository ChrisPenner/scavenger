import * as Res from './resources.js'
import {getStory, getClue, getAnswer} from './reducers.js'

const fetchResource = (Resource, actionType) => (dispatch) => {
    return Resource.index()
                .then(json => dispatch({
                    type: actionType,
                    data: json,
                }))
}

const setter = (type) => (uid) => (field, value) => ({
    type: type,
    uid,
    field,
    value,
})

const saveResource = (Resource, actionType, getCurrentState) => (uid) => (_) => (dispatch, getState) => {
    console.log(dispatch, getState)
    const currentState = getCurrentState(getState(), uid)
    return Resource.put(uid, currentState)
                .then(json=>console.log(json))
                .catch(err=>console.log(err))
}

export const LOAD_CLUES = 'LOAD_CLUES'
export const LOAD_STORIES = 'LOAD_STORIES'
export const LOAD_ANSWERS = 'LOAD_ANSWERS'

export const loadStories = fetchResource(Res.Story, LOAD_STORIES)
export const loadClues = fetchResource(Res.Clue, LOAD_CLUES)
export const loadAnswers = fetchResource(Res.Answer, LOAD_ANSWERS)

export const CHANGE_STORY = 'CHANGE_STORY'
export const CHANGE_CLUE = 'CHANGE_CLUE'
export const CHANGE_ANSWER = 'CHANGE_ANSWER'

export const changeStory = setter(CHANGE_STORY)
export const changeClue = setter(CHANGE_CLUE)
export const changeAnswer = setter(CHANGE_ANSWER)

export const SAVE_STORY = 'SAVE_STORY'
export const SAVE_CLUE = 'SAVE_CLUE'
export const SAVE_ANSWER = 'SAVE_ANSWER'

export const saveStory = saveResource(Res.Story, SAVE_STORY, getStory)
export const saveClue = saveResource(Res.Clue, SAVE_CLUE, getClue)
export const saveAnswer = saveResource(Res.Answer, SAVE_ANSWER, getAnswer)


export const ADD_STORY = 'ADD_STORY'
export const ADD_CLUE = 'ADD_CLUE'
export const ADD_ANSWER = 'ADD_ANSWER'

export const addStory = (uid) =>({ type: ADD_STORY, uid })
export const addClue = (uid) =>({ type: ADD_CLUE, uid })
export const addAnswer = (uid) =>({ type: ADD_ANSWER, uid })
