/* @flow */
import React from 'react'
import R from 'ramda'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { getGroupMessages, getStoryMessages } from '../selectors'
import { Message } from '../resources'
import { fetchGroupMessage, fetchStoryMessage } from '../actions'
import type { MessageType } from '../resources'
import { isPending } from '../lib/middleman/pending'

import loadingGuard from '../lib/loaded'

const stateToPropsGroup = (state, {params:{groupUid}}) => {
  return {
    messages: getGroupMessages(state, groupUid),
    identifier: groupUid,
    isPending: isPending(state, Message),
  }
}

const stateToPropsStory = (state, {params:{storyUid}}) => {
  return {
    messages: getStoryMessages(state, storyUid),
    identifier: storyUid,
    isPending: isPending(state, Message),
  }
}

const dispatchPropsGroup = { fetchMore: fetchGroupMessage }
const dispatchPropsStory = { fetchMore: fetchStoryMessage }

type MessagesProps = {
  messages: Array<MessageType>,
  identifier: string,
  fetchMore: Function,
  isPending: boolean,
}
const Messages = ({messages, identifier, fetchMore, isPending}: MessagesProps) => {
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
    <div>
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
      <div className='columns'>
        <a className={classnames('button', 'is-primary', 'column', {'is-loading': isPending})}
          onClick={() => fetchMore(identifier)}>
          + Load More
      </a>
      </div>
    </div>
  )
}

export const GroupMessages = R.compose(
  // loadingGuard([Message.type]),
  connect(stateToPropsGroup, dispatchPropsGroup)
)(Messages)

export const StoryMessages = R.compose(
  // loadingGuard([Message.type]),
  connect(stateToPropsStory, dispatchPropsStory)
)(Messages)
