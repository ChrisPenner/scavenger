/* @flow */
import xml2js from 'xml2js-es6-promise'
import R from 'ramda'
import swal from 'sweetalert'
import { successToast } from '../lib/wisp'
import { push, goBack } from 'react-router-redux'
import { createAction, createActions } from 'redux-actions'

import at from '../action-types'
import { Story, Code, Clue, Answer, Group, Message } from '../resources'
import type { ResourceT } from '../resources'
import { getStory, getClue, getAnswer, getExplorer, getDragData } from '../reducers'
import * as Routes from '../routes'
import type { routeT } from '../routes'
import type { apiT } from '../api'
import { API, INDEX, DELETE, PUT } from '../lib/middleman'

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
const dropper = (actionType: string) => (index: number) => (dispatch: any, getState: Function) => {
   const uid = getDragData(getState())
   dispatch({ type: actionType, payload: {uid, index}})
 }

export const dropClue = dropper(at.DROP_CLUE)
export const dropAnswer = dropper(at.DROP_ANSWER)

const saveResource = (resource: ResourceT, getResourceState: Function) => (uid: string) => (dispatch: any, getState: Function) => {
  return dispatch({
    type: at.set(resource.type),
    [API]: {
      route: resource.api.route(uid),
      method: PUT,
      payload: getResourceState(getState(), uid),
    }
  }).then(R.tap(() => dispatch(successToast('Saved'))))
}

export const saveStory = saveResource(Story, getStory)
export const saveClue = saveResource(Clue, getClue)
export const saveAnswer = saveResource(Answer, getAnswer)

const deleter = (resource: ResourceT) => (uid: string, route: ?string) => (dispatch: Function, getState: Function) => swal({
  title: "Delete?",
  type: "warning",
  showCancelButton: true,
  closeOnConfirm: false,
  showLoaderOnConfirm: true,
}, (confirmed) => {
  if (confirmed) {
    dispatch(push(route))
    return dispatch({
      type: at.del(resource.type),
      payload: {
        uid,
      },
      [API]: {
        route: resource.api.route(uid),
        method: DELETE,
        context: {
          uid
        }
      }
    })
      .then(() => swal({
        title: "Deleted",
        type: "success",
        showConfirmButton: false,
        timer: 700,
      }))
      .catch((message) => {
        dispatch(goBack())
        swal("Error", message, "error")
      })
  }
})


export const deleteStory = deleter(Story)
export const deleteClue = deleter(Clue)
export const deleteAnswer = deleter(Answer)

const loader = (resource: ResourceT) => () => ({
  type: at.load(resource.type),
  [API]: {
    route: resource.api.route(),
    method: INDEX,
  }
})

export const loadStory = loader(Story)
export const loadCodes = loader(Code)
export const loadClue = loader(Clue)
export const loadAnswer = loader(Answer)
export const loadGroup = loader(Group)
export const loadMessage = loader(Message)

export const creator = (resource: ResourceT) => (payload: any) => (dispatch: any, getState: Function) => {
  return dispatch({
    type: at.set(resource.type),
    payload,
    [API]: {
      route: resource.api.route(payload.uid),
      method: PUT,
      payload,
    }
  }).then(() => dispatch(push(resource.route(payload.uid))))
    .then(R.tap(() => dispatch(successToast('Created'))))
}

export const createStory = creator(Story)
export const createClue = creator(Clue)
export const createAnswer = creator(Answer)

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
  return fetch(Routes.twilio(), {
    method: 'POST',
    body: formData,
    credentials: 'same-origin',
  }).then(resp => resp.text())
    .then(parseTwiML)
    .then(makeMessageObjects)
    .then(R.map(R.compose(dispatch, receiveMessage)))
}
