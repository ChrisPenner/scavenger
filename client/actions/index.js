/* @flow */
import xml2js from 'xml2js-es6-promise'
import R from 'ramda'
import swal from 'sweetalert'
import { successToast } from '../lib/wisp'
import { push } from 'react-router-redux'
import { createAction, createActions } from 'redux-actions'

import at from '../action-types'
import { Story, Clue, Answer, Group } from '../resources'
import type { ResourceT } from '../resources'
import { getStory, getClue, getAnswer, getExplorer, getDragData } from '../reducers'
import * as Routes from '../routes'
import type { routeT } from '../routes'
import type { apiT } from '../api'

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

  startDrag,
  stopDrag,

  receiveMessage,

} = createActions({
  [at.change(Story.type)]: changer,
  [at.change(Clue.type)]: changer,
  [at.change(Answer.type)]: changer,
  [at.CHANGE_EXPLORER]: changer,

  [at.RECEIVE_MESSAGE]: R.assoc('source', 'server'),
},
  at.set(Story.type),
  at.set(Clue.type),
  at.set(Answer.type),
  at.START_DRAG,
  at.STOP_DRAG
)

// Async
export const dropAnswer = (index: number) => (dispatch: any, getState: Function) => {
  const uid = getDragData(getState())
  dispatch({ type: at.DROP_ANSWER, payload: {uid, index}})
}

const saveResource = (resource: ResourceT, setResource: Function, getResourceState: Function) => (uid: string) => (dispatch: any, getState: Function, { PUT }: apiT) => {
  const currentState = getResourceState(getState(), uid)
  return PUT(resource, uid, currentState)
    .then((result) => dispatch(setResource(result)))
    .then(R.tap(() => dispatch(successToast('Saved'))))
}

export const saveStory = saveResource(Story, setStory, getStory)
export const saveClue = saveResource(Clue, setClue, getClue)
export const saveAnswer = saveResource(Answer, setAnswer, getAnswer)

const deleter = (resource: ResourceT) => (uid: string, route: ?string) => (dispatch: Function, getState: Function, { DELETE }: apiT) => swal({
  title: "Delete?",
  type: "warning",
  showCancelButton: true,
  closeOnConfirm: false,
  showLoaderOnConfirm: true,
}, (confirmed) => {
  if (confirmed) {
    return DELETE(resource, uid)
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

const loader = (resource: ResourceT) => () => (dispatch: Function, getState: Function, { INDEX }: apiT) => {
  dispatch({
    type: at.load(resource.type),
    payload: INDEX(resource),
  })
}

export const loadStory = loader(Story)
export const loadGroup = loader(Group)
export const loadClue = loader(Clue)
export const loadAnswer = loader(Answer)

export const creator = (resource: ResourceT, route: routeT, setter: Function) => (payload: any) => (dispatch: any, getState: Function, { PUT }: apiT) => {
  return PUT(resource, payload.uid, payload)
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
  const {sender, receiver, text, mediaUrl} = getExplorer(getState())
  dispatch({
    type: at.SEND_MESSAGE,
    payload: {
      receiver,
      sender,
      body: text,
      mediaUrl: mediaUrl,
      source: 'user',
    }
  })
  // https://www.twilio.com/docs/api/twiml/sms/twilio_request#request-parameters
  const formData = new FormData()
  formData.append('From', sender)
  formData.append('To', receiver)
  formData.append('Body', text)
  if(mediaUrl) {
    formData.append('MediaUrl0', mediaUrl)
    formData.append('NumMedia', '1')
  }
  return fetch(Routes.message(), {
    method: 'POST',
    body: formData,
    credentials: 'same-origin',
  }).then(resp => resp.text())
    .then(parseTwiML)
    .then(makeMessageObjects)
    .then(R.map(R.compose(dispatch, receiveMessage)))
}
