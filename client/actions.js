import xml2js from 'xml2js-es6-promise'
import { Story, Clue, Answer } from 'resources'
import { getStory, getClue, getAnswer, getExplorer } from 'reducers'
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

const changer = (type) => (path, value) => ({
  type: type,
  path,
  value,
})

const adder = (type) => (payload) => ({
  type,
  payload,
})

const setter = (type) => (payload) => ({
  type,
  payload,
})

const successMessage = message => () => toastr.success(message, 'Success')
const handleError = err => {
  toastr.error(err, 'Error');
  throw err
}

const saveResource = (Resource, actionType, getResourceState) => (uid) => (dispatch, getState) => {
  const currentState = getResourceState(getState(), uid)
  return Resource.put(uid, currentState)
    .then(successMessage('Saved'))
}

export const receiveMessage = (payload) => {
  return {
    type: at.RECEIVE_MESSAGE,
    payload,
  }
}

const parseTwiML = xml2js

const messageLens = R.lensPath(['Response', 'Message', 0])
const bodyLens = R.compose(
  messageLens,
  R.lensPath(['Body', 0])
)

const toLens = R.compose(
  messageLens,
  R.lensPath(['$', 'to'])
)

const makeTextObj = (twimlObj) => ({
  body: R.view(bodyLens, twimlObj),
  to: R.view(toLens, twimlObj),
})

export const sendMessage = () => (dispatch, getState) => {
  const {fromNumber, toNumber, text} = getExplorer(getState())
  dispatch({
    type: at.SEND_MESSAGE,
    payload: {
      to: toNumber,
      from: fromNumber,
      body: text,
    }
  })
  // https://www.twilio.com/docs/api/twiml/sms/twilio_request#request-parameters
  const formData = new FormData()
  formData.append('From', fromNumber)
  formData.append('Body', text)
  return fetch(Routes.message(), {
    method: 'post',
    body: formData,
  }).then(resp => resp.text())
    .then(parseTwiML)
    .then(makeTextObj)
    .then(R.compose(dispatch, receiveMessage))
}

export const loadStories = fetchResource(Story, at.LOAD_STORIES)
export const loadClues = fetchResource(Clue, at.LOAD_CLUES)
export const loadAnswers = fetchResource(Answer, at.LOAD_ANSWERS)

export const changeStory = changer(at.CHANGE_STORY)
export const changeClue = changer(at.CHANGE_CLUE)
export const changeAnswer = changer(at.CHANGE_ANSWER)
export const changeExplorer = changer(at.CHANGE_EXPLORER)

export const saveStory = saveResource(Story, at.SAVE_STORY, getStory)
export const saveClue = saveResource(Clue, at.SAVE_CLUE, getClue)
export const saveAnswer = saveResource(Answer, at.SAVE_ANSWER, getAnswer)

export const addStory = adder(at.ADD_STORY)
export const addClue = adder(at.ADD_CLUE)
export const addAnswer = adder(at.ADD_ANSWER)

export const setStory = setter(at.SET_STORY)
export const setClue = setter(at.SET_CLUE)
export const setAnswer = setter(at.SET_ANSWER)

export const createStory = (payload) => (dispatch) => {
  Story.put(payload.uid, payload)
    .then((story) => dispatch(setStory(story)))
    .then(() => dispatch(push(Routes.story(payload.uid))))
    .then(successMessage('Created'))
}

export const createClue = (payload) => (dispatch) => {
  Clue.put(payload.uid, payload)
    .then((clue) => dispatch(setClue(clue)))
    .then(() => dispatch(push(Routes.clue(payload.uid))))
    .then(successMessage('Created'))
}

export const createAnswer = (payload) => (dispatch) => {
  const [storyId, clueId, _] = payload.uid.split(':')
  Answer.put(payload.uid, payload)
    .then((answer) => dispatch(setAnswer(answer)))
    .then(() => dispatch(push(Routes.clue(`${storyId}:${clueId}`))))
    .then(successMessage('Created'))
}
