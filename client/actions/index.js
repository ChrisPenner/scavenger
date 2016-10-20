/* @flow */
import xml2js from 'xml2js-es6-promise'
import R from 'ramda'
import swal from 'sweetalert'
import { successToast, errorToast } from '../lib/wisp'
import { push, goBack } from 'react-router-redux'
import { createAction } from 'redux-actions'

import at from '../actions/types'
import { Story, Code, Clue, Answer, Group, Message } from '../resources'
import type { ResourceT } from '../resources'
import { getExplorer } from '../selectors'
import * as Routes from '../routes'

import type { MessageType } from '../resources'

export type FSA = {
  type: string,
  payload?: any,
  error?: any,
  meta?: any,
}

const deleter = (resource: ResourceT) => (uid: string, route: ?string) => (dispatch: Function) => swal({
  title: 'Delete?',
  type: 'warning',
  showCancelButton: true,
  closeOnConfirm: false,
  showLoaderOnConfirm: true,
}, (confirmed) => {
  if (confirmed) {
    dispatch(push(route))
    return dispatch({
      type: at.del(resource.type),
      payload: uid,
    })
      .then(() => swal({
        title: 'Deleted',
        type: 'success',
        showConfirmButton: false,
        timer: 700,
      }))
      .catch((message) => {
        dispatch(goBack())
        swal('Error', message, 'error')
      })
  }
})

const saver = (resource: ResourceT) => (uid: string) => (dispatch: Function) => {
  return dispatch({
    type: at.save(resource.type),
    payload: uid,
  }).then(() => dispatch(successToast('Saved')))
  .catch(() => dispatch(errorToast('Failed to Save')))
}

const changer = (path: Array<string>, value: any) => ({path, value})

const creator = (resource: ResourceT) => (payload: any) => (dispatch: Function) => {
  return dispatch({
    type: at.create(resource.type),
    payload,
  }).then(() => dispatch(push(resource.route(payload.uid))))
    .then(R.tap(() => dispatch(successToast('Created'))))
    .catch(() => dispatch(errorToast('Failed to Create')))
}

export const genericAction = R.curry((type, payload) => ({type, payload}))

export const changeTestMessage = createAction(at.CHANGE_TEST_MESSAGE)

export const receiveMessage = createAction(at.RECEIVE_MESSAGE, R.assoc('source', 'server'))

export const startDragClue = createAction(at.START_DRAG_CLUE)
export const startDragAnswer = createAction(at.START_DRAG_ANSWER)

export const dropClue = createAction(at.DROP_CLUE)
export const dropAnswer = createAction(at.DROP_ANSWER)

export const reorderClue = createAction(at.REORDER_CLUE)
export const reorderAnswer = createAction(at.REORDER_ANSWER)

export const changeStory = createAction(at.change(Story.type), changer)
export const changeClue = createAction(at.change(Clue.type), changer)
export const changeAnswer = createAction(at.change(Answer.type), changer)
export const changeExplorer = createAction(at.CHANGE_EXPLORER, changer)

export const fetchStory = createAction(at.fetch(Story.type))
export const fetchClue = createAction(at.fetch(Clue.type))
export const fetchAnswer = createAction(at.fetch(Answer.type))
export const fetchGroup = createAction(at.fetch(Group.type))
export const fetchMessage = createAction(at.fetch(Message.type))
export const fetchCode = createAction(at.fetch(Code.type))

export const fetchGroupMessage = createAction(at.FETCH_MESSAGES_BY_GROUP)
export const fetchStoryMessage = createAction(at.FETCH_MESSAGES_BY_STORY)

export const deleteStory = deleter(Story)
export const deleteClue = deleter(Clue)
export const deleteAnswer = deleter(Answer)

export const createStory = creator(Story)
export const createClue = creator(Clue)
export const createAnswer = creator(Answer)

export const saveStory = saver(Story)
export const saveClue = saver(Clue)
export const saveAnswer = saver(Answer)

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
