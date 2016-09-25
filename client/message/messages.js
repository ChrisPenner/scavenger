/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { getGroupMessages, getStoryMessages } from '../reducers'

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

export const GroupMessages = connect(state=> ({messages: getGroupMessages})(Messages))
export const StoryMessages = connect(state=> ({messages: getStoryMessages})(Messages))
