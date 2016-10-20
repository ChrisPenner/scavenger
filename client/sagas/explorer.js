import R from 'ramda'
import xml2js from 'xml2js-es6-promise'
import { put, select, call } from 'redux-saga/effects'

import { getExplorer } from '../selectors'
import at from '../actions/types'
import * as Routes from '../routes'
import { receiveMessage } from '../actions'

import type { MessageType } from '../resources'

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

export function* sendExplorerMessage() {
  const {sender, receiver, text, mediaUrl} = yield select(getExplorer)
  yield put({
    type: at.SEND_MESSAGE,
    payload: {
      receiver,
      sender,
      text,
      mediaUrl: mediaUrl,
      source: 'user',
    }
  })

  const formData = new FormData()
  formData.append('From', sender)
  formData.append('To', receiver)
  formData.append('Body', text)
  if(mediaUrl) {
    formData.append('MediaUrl0', mediaUrl)
    formData.append('NumMedia', '1')
  }

  const response = yield call(fetch, Routes.twilio(), {
    method: 'POST',
    body: formData,
    credentials: 'same-origin',
  })

  const responseBody = yield call(response.text.bind(response))
  const parsed = yield call(parseTwiML, responseBody)
  const messages = makeMessageObjects(parsed)
  const messageActions = messages.map(R.compose(put, receiveMessage))
  yield* messageActions
}
