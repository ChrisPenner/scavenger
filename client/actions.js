/* @flow */
import xml2js from 'xml2js-es6-promise'
import toastr from 'toastr'
import R from 'ramda'
import { push } from 'react-router-redux'

import { Story, Clue, Answer, index, put, del } from './resources'
import { getStory, getClue, getAnswer, getExplorer, getDragData } from './reducers'
import Routes from './routes'
import * as at from './action-types'
import type { ActionKind } from './action-types'

const actionCreator = R.curry((type, payload) => ({type, payload}))
const fetchResource = (Resource) => (dispatch: any) => {
  const actionFactory = actionCreator(at.load(Resource.type))
  return index(Resource)
    .then(actionFactory)
    .then(dispatch)
}

type ChangeAction = {
  type: ActionKind,
  path: Array<string>,
  payload: any,
}

const changer = (type: ActionKind) => (path: Array<string>, payload: any):ChangeAction => ({
  type: type,
  path,
  payload,
})

const setter = (type: ActionKind) => (payload: any) => ({
  type,
  payload,
})

const successMessage = message => () => toastr.success(message)

const saveResource = (Resource, setResource, getResourceState) => (uid: string) => (dispatch: any, getState: () => Object) => {
  const currentState = getResourceState(getState(), uid)
  return put(Resource, uid, currentState)
    .then((result) => dispatch(setResource(result)))
    .then(successMessage('Saved'))
}

export const deleted = (resourceType: ActionKind, uid: string) => ({
  type: at.del(resourceType),
  payload: { uid },
})

const deleteResource = (Resource) => (uid: string) => (dispatch: any) => {
  return del(Resource, uid)
    .then(() => dispatch(deleted(Resource.type, uid)))
    .then(successMessage('Deleted'))
}

export const receiveMessage = (payload: any) => {
  payload.source = 'server'
  return {
    type: at.RECEIVE_MESSAGE,
    payload,
  }
}

const parseTwiML = xml2js

const focusMessages = R.lensPath(['Response', 'Message'])
const focusBody = R.lensPath(['Body', 0])
const focusMedia = R.lensPath(['Media', 0])
const focusTo = R.lensPath(['$', 'to'])
const focusSender = R.lensPath(['$', 'from'])
const intoMessage = R.applySpec({
  body: R.view(focusBody),
  to: R.view(focusTo),
  sender: R.view(focusSender),
  mediaUrl: R.view(focusMedia),
})

const makeMessageObjects = R.compose(R.map(intoMessage), R.view(focusMessages))

export const sendMessage = () => (dispatch: any, getState: any) => {
  const {sender, receiver, text} = getExplorer(getState())
  dispatch({
    type: at.SEND_MESSAGE,
    payload: {
      receiver,
      sender,
      body: text,
      source: 'user',
    }
  })
  // https://www.twilio.com/docs/api/twiml/sms/twilio_request#request-parameters
  const formData = new FormData()
  formData.append('From', sender)
  formData.append('To', receiver)
  formData.append('Body', text)
  return fetch(Routes.message(), {
    method: 'POST',
    body: formData,
  }).then(resp => resp.text())
    .then(parseTwiML)
    .then(makeMessageObjects)
    .then(R.map(R.compose(dispatch, receiveMessage)))
}

type SimpleAction = {
  type: ActionKind,
  payload?: any,
}

export const loadStories = fetchResource(Story)
export const loadClues = fetchResource(Clue)
export const loadAnswers = fetchResource(Answer)

export const changeStory = changer(at.change(Story.type))
export const changeClue = changer(at.change(Clue.type))
export const changeAnswer = changer(at.change(Answer.type))
export const changeExplorer = changer(at.CHANGE_EXPLORER)

export const changeTestMessage = (payload: any): SimpleAction => ({
  type: at.CHANGE_TEST_MESSAGE,
  payload,
})

export const deleteStory = deleteResource(Story)
export const deleteClue = deleteResource(Clue)
export const deleteAnswer = deleteResource(Answer)

export const setStory = setter(at.set(Story.type))
export const setClue = setter(at.set(Clue.type))
export const setAnswer = setter(at.set(Answer.type))

export const saveStory = saveResource(Story, setStory, getStory)
export const saveClue = saveResource(Clue, setClue, getClue)
export const saveAnswer = saveResource(Answer, setAnswer, getAnswer)

export const createStory = (payload: any) => (dispatch: any) => {
  put(Story, payload.uid, payload)
    .then((story) => dispatch(setStory(story)))
    .then(() => dispatch(push(Routes.story(payload.uid))))
    .then(successMessage('Created'))
}

export const createClue = (payload: any) => (dispatch: any) => {
  put(Clue, payload.uid, payload)
    .then((clue) => dispatch(setClue(clue)))
    .then(() => dispatch(push(Routes.clue(payload.uid))))
    .then(successMessage('Created'))
}

export const createAnswer = (payload: any) => (dispatch: any) => {
  put(Answer, payload.uid, payload)
    .then((answer) => dispatch(setAnswer(answer)))
    .then(() => dispatch(push(Routes.answer(payload.uid))))
    .then(successMessage('Created'))
}

export const reorderAnswer = (uid: string, index: number): SimpleAction => ({
  type: at.REORDER_ANSWER,
    payload: {
      uid,
      index
    }
})

export const startDrag = (payload: any): SimpleAction => ({
  type: at.START_DRAG,
  payload,
})

export const stopDrag = ():SimpleAction => ({ type: at.STOP_DRAG })

export const dropAnswer = (index: number) => (dispatch: any, getState: () => Object) => {
  const answerUid = getDragData(getState())
  dispatch(reorderAnswer(answerUid, index))
  dispatch(stopDrag)
}
