import {Story, Clue, Answer} from 'resources'
import { getStory, getClue, getAnswer } from 'reducers'
import { push } from 'react-router-redux'
import Routes from 'routes'
import * as at from 'action-types'

const fetchResource = (Resource, actionType) => (dispatch) => {
    return Resource.index()
        .then(json => dispatch({
            type: actionType,
            payload: json,
        }))
}

const setter = (type) => (uid, field, value) => ({
    type: type,
    uid,
    field,
    value,
})

const saveResource = (Resource, actionType, getResourceState) => (uid) => (dispatch, getState) => {
    const currentState = getResourceState(getState(), uid)
    return Resource.put(uid, currentState)
        .catch(err=>console.error(err))
}

export const loadStories = fetchResource(Story, at.LOAD_STORIES)
export const loadClues = fetchResource(Clue, at.LOAD_CLUES)
export const loadAnswers = fetchResource(Answer, at.LOAD_ANSWERS)

export const changeStory = setter(at.CHANGE_STORY)
export const changeClue = setter(at.CHANGE_CLUE)
export const changeAnswer = setter(at.CHANGE_ANSWER)

export const saveStory = saveResource(Story, at.SAVE_STORY, getStory)
export const saveClue = saveResource(Clue, at.SAVE_CLUE, getClue)
export const saveAnswer = saveResource(Answer, at.SAVE_ANSWER, getAnswer)

export const addStory = (payload) => ({ type: at.ADD_STORY, payload})
export const addClue = (payload) => ({ type: at.ADD_CLUE, payload})
export const addAnswer = (payload) => ({ type: at.ADD_ANSWER, payload})

export const setStory = (payload) => ({ type: at.SET_STORY, payload, })
export const setClue = (payload) => ({ type: at.SET_CLUE, payload, })
export const setAnswer = (payload) => ({ type: at.SET_ANSWER, payload, })

export const createStory = (payload) => (dispatch) => {
    Story.put(payload.uid, payload)
        .then((story) => dispatch(setStory(story)))
        .then(() => dispatch(push(Routes.story(payload.uid))))
        .catch(err=>console.error(err))
}

export const createClue = (payload) => (dispatch) => {
    Clue.put(payload.uid, payload)
        .then((clue) => dispatch(setClue(clue)))
        .then(() => dispatch(push(Routes.clue(payload.uid))))
        .catch(err=>console.error(err))
}

export const createAnswer = (payload) => (dispatch) => {
    const [storyID, clueID, _] = payload.uid.split(':')
    Answer.put(payload.uid, payload)
        .then((answer) => dispatch(setAnswer(answer)))
        .then(() => dispatch(push(Routes.clue(`${storyID}:${clueID}`))))
        .catch(err=>console.error(err))
}
