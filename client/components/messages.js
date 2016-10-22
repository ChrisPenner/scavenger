/* @flow */
import React from 'react'
import R from 'ramda'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { getGroupMessages, getStoryMessages } from '../selectors'
import { fetchGroupMessage, fetchStoryMessage, mkIdentifier } from '../actions'
import at from '../actions/types'
import type { MessageType } from '../resources'
import { isPending } from '../lib/middleman/pending'
import { hasMore } from '../lib/middleman/pagination'

const stateToPropsGroup = (state, {params:{groupUid}}) => {
  return {
    messages: getGroupMessages(state, groupUid),
    identifier: groupUid,
    isPending: isPending(state, mkIdentifier(at.FETCH_MESSAGES_BY_GROUP, groupUid)),
    hasMore: hasMore(state, mkIdentifier(at.FETCH_MESSAGES_BY_GROUP, groupUid)),
  }
}

const stateToPropsStory = (state, {params:{storyUid}}) => {
  return {
    messages: getStoryMessages(state, storyUid),
    identifier: storyUid,
    isPending: isPending(state, mkIdentifier(at.FETCH_MESSAGES_BY_STORY, storyUid)),
    hasMore: hasMore(state, mkIdentifier(at.FETCH_MESSAGES_BY_STORY, storyUid)),
  }
}

const dispatchPropsGroup = { fetchMore: fetchGroupMessage }
const dispatchPropsStory = { fetchMore: fetchStoryMessage }

type MessagesProps = {
  messages: Array<MessageType>,
  identifier: string,
  fetchMore: Function,
  isPending: boolean,
  hasMore: boolean,
}
const Messages = ({messages, identifier, fetchMore, isPending, hasMore}: MessagesProps) => {
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
        <a className={classnames('button', 'is-primary', 'column', {'is-loading': isPending, 'is-disabled': !hasMore})}
          onClick={() => fetchMore(identifier)}>
          {hasMore ? '+ Load More'
                   : 'Loaded'
          }
      </a>
      </div>
    </div>
  )
}

export const GroupMessages = R.compose(
  connect(stateToPropsGroup, dispatchPropsGroup)
)(Messages)

export const StoryMessages = R.compose(
  connect(stateToPropsStory, dispatchPropsStory)
)(Messages)
