/* @flow */
import xml2js from 'xml2js-es6-promise'
import toastr from 'toastr'
import R from 'ramda'
import swal from 'sweetalert'
import { successToast } from './lib/wisp'
import { push } from 'react-router-redux'
import { createAction, createActions } from 'redux-actions'

import at from './action-types'
import { Story, Clue, Answer, index, put, del } from './resources'
import type { ResourceT } from './resources'
import { getStory, getClue, getAnswer, getExplorer, getDragData } from './reducers'
import * as Routes from './routes'
import type { routeT } from './routes'

export type FSA = {
  type: string,
  payload?: any,
  error?: any,
  meta?: any,
}

const changer = (path: Array<string>, value: any) => ({path, value})

export const changeTestMessage = (payload: any): FSA => ({
  type: at.CHANGE_TEST_MESSAGE,
  payload,
})

export const {
  changeStory,
  changeClue,
  changeAnswer,
  changeExplorer,

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
  [at.CHANGE_STORY]: changer,
  [at.CHANGE_CLUE]: changer,
  [at.CHANGE_ANSWER]: changer,
  [at.CHANGE_EXPLORER]: changer,

  [at.LOAD_STORY]: () => index(Story),
  [at.LOAD_CLUE]: () => index(Clue),
  [at.LOAD_ANSWER]: () => index(Answer),

  [at.RECEIVE_MESSAGE]: R.assoc('source', 'server'),
},
  at.SET_STORY,
  at.SET_CLUE,
  at.SET_ANSWER,
  at.START_DRAG,
  at.STOP_DRAG
)

// Async
export const dropAnswer = (index: number) => (dispatch: any, getState: Function) => {
  const uid = getDragData(getState())
  dispatch({ type: at.DROP_ANSWER, payload: {uid, index}})
}

const saveResource = (resource, setResource, getResourceState) => (uid: string) => (dispatch: any, getState: Function) => {
  const currentState = getResourceState(getState(), uid)
  return put(resource, uid, currentState)
    .then((result) => dispatch(setResource(result)))
    .then(R.tap(() => dispatch(successToast('Saved'))))
}

export const saveStory = saveResource(Story, setStory, getStory)
export const saveClue = saveResource(Clue, setClue, getClue)
export const saveAnswer = saveResource(Answer, setAnswer, getAnswer)

const deleter = (resource: ResourceT) => (uid: string, route: ?string) => (dispatch: Function) => swal({
  title: "Delete?",
  type: "warning",
  showCancelButton: true,
  closeOnConfirm: false,
  showLoaderOnConfirm: true,
}, (confirmed) => {
  if (confirmed) {
    return del(resource, uid)
      .then(() => dispatch(push(route)))
      .then(() => dispatch({
        type: `DELETE_${resource.type}`,
        payload: {uid},
      }))
      .then(() => swal({
        title: "Deleted",
        type: "success",
        showConfirmButton: false,
        timer: 700,
      }))
      .catch((message) => swal("Error", message, "error"))
  }
})


export const deleteStory = deleter(Story)
export const deleteClue = deleter(Clue)
export const deleteAnswer = deleter(Answer)

export const creator = (resource: ResourceT, route: routeT, setter: Function) => (payload: any) => (dispatch: any) => {
  return put(resource, payload.uid, payload)
    .then((entity) => dispatch(setter(entity)))
    .then(() => dispatch(push(route(payload.uid))))
    .then(R.tap(() => dispatch(successToast('Created'))))
}

export const createStory = creator(Story, Routes.story, setStory)
export const createClue = creator(Clue, Routes.clue, setClue)
export const createAnswer = creator(Answer, Routes.answer, setAnswer)

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
