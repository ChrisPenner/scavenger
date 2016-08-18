import xml2js from 'xml2js-es6-promise'
import { Story, Clue, Answer, index, put, del } from 'resources'
import { getStory, getClue, getAnswer, getExplorer, getDragData } from 'reducers'
import { push } from 'react-router-redux'
import Routes from 'routes'
import * as at from 'action-types'

const fetchResource = (Resource, actionType) => (dispatch) => {
  return index(Resource)
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

const successMessage = message => () => toastr.success(message)
const handleError = err => {
  toastr.error(err, 'Error');
  throw err
}

const saveResource = (Resource, getResourceState) => (uid) => (dispatch, getState) => {
  const currentState = getResourceState(getState(), uid)
  return put(Resource, uid, currentState)
    .then(successMessage('Saved'))
}

export const deleted = (resourceType, uid) => ({
  type: at.del(resourceType),
  payload: { uid },
})

const deleteResource = (Resource) => (uid) => (dispatch) => {
  return del(Resource, uid)
    .then(() => dispatch(deleted(Resource.type, uid)))
    .then(successMessage('Deleted'))
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

export const loadStories = fetchResource(Story, at.load(Story.type))
export const loadClues = fetchResource(Clue, at.load(Clue.type))
export const loadAnswers = fetchResource(Answer, at.load(Answer.type))

export const changeStory = changer(at.change(Story.type))
export const changeClue = changer(at.change(Clue.type))
export const changeAnswer = changer(at.change(Answer.type))
export const changeExplorer = changer(at.CHANGE_EXPLORER)

export const saveStory = saveResource(Story, getStory)
export const saveClue = saveResource(Clue, getClue)
export const saveAnswer = saveResource(Answer, getAnswer)

export const deleteStory = deleteResource(Story)
export const deleteClue = deleteResource(Clue)
export const deleteAnswer = deleteResource(Answer)

export const setStory = setter(at.set(Story.type))
export const setClue = setter(at.set(Clue.type))
export const setAnswer = setter(at.set(Answer.type))

export const createStory = (payload) => (dispatch) => {
  put(Story, payload.uid, payload)
    .then((story) => dispatch(setStory(story)))
    .then(() => dispatch(push(Routes.story(payload.uid))))
    .then(successMessage('Created'))
}

export const createClue = (payload) => (dispatch) => {
  put(Clue, payload.uid, payload)
    .then((clue) => dispatch(setClue(clue)))
    .then(() => dispatch(push(Routes.clue(payload.uid))))
    .then(successMessage('Created'))
}

export const createAnswer = (payload) => (dispatch) => {
  put(Answer, payload.uid, payload)
    .then((answer) => dispatch(setAnswer(answer)))
    .then(() => dispatch(push(Routes.answer(payload.uid))))
    .then(successMessage('Created'))
}

export const reorderAnswer = (uid, index) => ({
  type: at.REORDER_ANSWER,
    payload: {
      uid,
      index
    }
})

export const startDrag = (payload) => ({
  type: at.START_DRAG,
  payload,
})

export const stopDrag = () => ({ type: at.START_DRAG })

export const dropAnswer = (index) => (dispatch, getState) => {
  const answerUid = getDragData(getState())
  dispatch(reorderAnswer(answerUid, index))
  dispatch(stopDrag)
}
