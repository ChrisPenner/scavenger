/* @flow */
import React from 'react'
import R from 'ramda'

import { connect } from 'react-redux'
import { getMessagesByGroup, getMessagesByStory } from '../reducers'

const Messages = ({messages}: Object) => {
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
Messages.propTypes = {
  messages: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}

const byDateDescending = R.comparator((d1, d2) => d1.sent > d2.sent)

const getGroupMessages = (state, {params}) => {
  const groupUid = params.groupUid;
  return {
    messages: R.sort(byDateDescending, R.values(getMessagesByGroup(state, groupUid))),
  }
}

const getStoryMessages = (state, {params}) => {
  const storyUid = params.storyUid;
  return {
    messages: R.sort(byDateDescending, R.values(getMessagesByStory(state, storyUid))),
  }
}

export const GroupMessages = connect(getGroupMessages)(Messages)
export const StoryMessages = connect(getStoryMessages)(Messages)
