/* @flow */
import xml2js from 'xml2js-es6-promise'
import toastr from 'toastr'
import R from 'ramda'
import { push } from 'react-router-redux'
import { createAction, createActions } from 'redux-actions'

import { Story, Clue, Answer, index, put, del } from './resources'
import type { ResourceT } from './resources'
import { getStory, getClue, getAnswer, getExplorer, getDragData } from './reducers'
import * as Routes from './routes'
import type { routeT } from './routes'
import * as at from './action-types'
import type { ActionKind } from './action-types'

export type FSA = {
  type: string,
  payload?: any,
  error?: any,
  meta?: any,
}

const changer = (path: Array<string>, value: any) => ({path, value})
const deleter = (resource:ResourceT) => (uid: string) => (dispatch: any) => {
  return del(resource, uid)
    .then(() => dispatch(deleted(resource.type, uid)))
    .then(successMessage('Deleted'))
}

const saveResource = (resource, setResource, getResourceState) => (uid: string) => (dispatch: any, getState: Function) => {
  const currentState = getResourceState(getState(), uid)
  return put(resource, uid, currentState)
    .then((result) => dispatch(setResource(result)))
    .then(successMessage('Saved'))
}


export const deleted = (resourceType: ActionKind, uid: string) => ({
  type: at.del(resourceType),
  payload: { uid },
})


export const successMessage = (message:string) => () => toastr.success(message)

const deleteResource = (resource) => (uid: string) => (dispatch: any) => {
  return del(resource, uid)
    .then(() => dispatch(deleted(resource.type, uid)))
    .then(successMessage('Deleted'))
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

export const changeTestMessage = (payload: any): FSA => ({
  type: at.CHANGE_TEST_MESSAGE,
  payload,
})

export const {
  changeStory,
  changeClue,
  changeAnswer,
  changeExplorer,

  deleteStory,
  deleteClue,
  deleteAnswer,

  setStory,
  setClue,
  setAnswer,

  loadStory,
  loadClue,
  loadAnswer,

  startDrag,
  stopDrag,

  receiveMessage,

} = createActions({
  CHANGE_STORY: changer,
  CHANGE_CLUE: changer,
  CHANGE_ANSWER: changer,
  CHANGE_EXPLORER: changer,

  DELETE_STORY: deleter(Story),
  DELETE_CLUE: deleter(Clue),
  DELETE_ANSWER: deleter(Answer),

  LOAD_STORY: () => index(Story),
  LOAD_CLUE: () => index(Clue),
  LOAD_ANSWER: () => index(Answer),

  RECEIVE_MESSAGE: R.assoc('source', 'server'),
},
  'SET_STORY',
  'SET_CLUE',
  'SET_ANSWER',
  'START_DRAG',
  'STOP_DRAG'
)

export const creator = (resource: ResourceT, route: routeT, setter: Function) => (payload: any) => (dispatch: any) => {
  return put(resource, payload.uid, payload)
    .then((entity) => dispatch(setter(entity)))
    .then(() => dispatch(push(route(payload.uid))))
    .then(successMessage('Created'))
}

export const {
  saveStory,
  saveClue,
  saveAnswer,

  createStory,
  createClue,
  createAnswer,
} = createActions({
  SAVE_STORY: saveResource(Story, setStory, getStory),
  SAVE_CLUE: saveResource(Clue, setClue, getClue),
  SAVE_ANSWER: saveResource(Answer, setAnswer, getAnswer),

  CREATE_STORY: creator(Story, Routes.story, setStory),
  CREATE_CLUE: creator(Clue, Routes.clue, setClue),
  CREATE_ANSWER: creator(Answer, Routes.answer, setAnswer),
})

// Thunks
export const dropAnswer = (index: number) => (dispatch: any, getState: Function) => {
  const uid = getDragData(getState())
  dispatch(createAction('DROP_ANSWER')({uid, index}))
}

// Async
