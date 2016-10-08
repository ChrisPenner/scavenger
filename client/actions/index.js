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

import type { MessageType } from '../resources'

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

  fetchStory,
  fetchClue,
  fetchAnswer,
  fetchGroup,
  fetchMessage,
  fetchCode,

  saveStory,
  saveClue,
  saveAnswer,

  deleteStory,
  deleteClue,
  deleteAnswer,

  receiveMessage,
} = createActions({
  [at.change(Story.type)]: changer,
  [at.change(Clue.type)]: changer,
  [at.change(Answer.type)]: changer,
  [at.CHANGE_EXPLORER]: changer,

  [at.RECEIVE_MESSAGE]: R.assoc('source', 'server'),
},
  at.START_DRAG,
  at.STOP_DRAG,

  at.fetch(Story.type),
  at.fetch(Clue.type),
  at.fetch(Answer.type),
  at.fetch(Group.type),
  at.fetch(Message.type),
  at.fetch(Code.type),

  at.save(Story.type),
  at.save(Clue.type),
  at.save(Answer.type),

  at.del(Story.type),
  at.del(Clue.type),
  at.del(Answer.type),
)

// Async
const dropper = (actionType: string) => (index: number) => (dispatch: Function, getState: Function) => {
   const uid = getDragData(getState())
   dispatch({ type: actionType, payload: {uid, index}})
 }

export const dropClue = dropper(at.DROP_CLUE)
export const dropAnswer = dropper(at.DROP_ANSWER)

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

export const creator = (resource: ResourceT) => (payload: any) => (dispatch: Function, getState: Function) => {
  return dispatch({
    type: at.set(resource.type),
    payload,
    ['API']: {
      route: resource.api.route(payload.uid),
      method: 'PUT',
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
const intoMessage: (t: Object) => MessageType = R.applySpec({
  text: R.view(focusBody),
  receiver: R.view(focusTo),
  sender: R.view(focusSender),
  mediaUrl: R.view(focusMedia),
})

const makeMessageObjects = R.compose(R.map(intoMessage), R.view(focusMessages))

export const sendMessage = () => (dispatch: Function, getState: Function) => {
  const {sender, receiver, text, mediaUrl} = getExplorer(getState())
  dispatch({
    type: at.SEND_MESSAGE,
    payload: {
      receiver,
      sender,
      text,
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
