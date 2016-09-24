/* @flow */
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Routes from '../routes'
import { getGroupUids, getStoryUids } from '../reducers'
export {GroupMessages, StoryMessages} from './messages.js'

const stateToProps = state => ({
  groupUids: getGroupUids(state),
  storyUids: getStoryUids(state),
})

export const MessageChoices = connect(stateToProps)(({groupUids, storyUids}) => {
  const groupList = groupUids.map(groupUid => (
        <div className="my-list-item" key={groupUid}>
          <Link
            to={Routes.groupMessages(groupUid)}> 
            {groupUid}
          </Link>
        </div>
    ))
  const storyList = storyUids.map(storyUid => (
        <div className="my-list-item" key={storyUid}>
          <Link
            to={Routes.storyMessages(storyUid)}> 
            {storyUid}
          </Link>
        </div>
    ))
  return (
    <section className="section">
      <section className="columns">
        <div className="column my-list">
          <h1 className="title"> Groups </h1>
          {groupList}
        </div>
        <div className="column my-list">
          <h1 className="title"> Stories </h1>
          {storyList}
        </div>
      </section>
    </section>
  )}
)
