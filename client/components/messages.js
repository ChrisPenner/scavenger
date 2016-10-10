/* @flow */
import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { getGroupMessages, getStoryMessages } from '../reducers'
import { Message } from '../resources'
import type { MessageType } from '../resources'

import loadingGuard from '../lib/loaded'

type MessagesProps = {
  messages: Array<MessageType>,
}
const Messages = ({messages}: MessagesProps) => {
  const messageRows = messages.map(({uid, text, mediaUrl, sender, receiver, groupUid, storyUid, sent}) => (
      <tr key={uid}>
        <td>
          {storyUid}
        </td>
        <td>
          {groupUid}
        </td>
        <td>
          {new Date(sent).toLocaleString()}
        </td>
        <td>
          {sender}
        </td>
        <td>
          {receiver}
        </td>
        <td>
          {text}
        </td>
        <td>
          {mediaUrl && <div><img src={mediaUrl} /></div> }
        </td>
      </tr>
    ))
  return (
    <table className="table is-bordered">
      <thead>
        <tr>
          <th>
            Story
          </th>
          <th>
            Group
          </th>
          <th>
            Sent At
          </th>
          <th>
            Sender
          </th>
          <th>
            Receiver
          </th>
          <th>
            Text
          </th>
          <th>
            Media
          </th>
        </tr>
      </thead>
      <tbody>
        {messageRows}
      </tbody>
    </table>
  )
}

const stateToPropsGroup = (state, {params:{groupUid}}) => {
  return {
    messages: getGroupMessages(state, groupUid)
  }
}

const stateToPropsStory = (state, {params:{storyUid}}) => {
  return {
    messages: getStoryMessages(state, storyUid)
  }
}

export const GroupMessages = R.compose(
  loadingGuard([Message.type]),
  connect(stateToPropsGroup)
)(Messages)

export const StoryMessages = R.compose(
  loadingGuard([Message.type]),
  connect(stateToPropsStory)
)(Messages)
