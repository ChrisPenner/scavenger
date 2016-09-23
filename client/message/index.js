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

export const MessageChoices = connect(stateToProps)(({groupUids, storyUids}) => (
  <section className="section">
    <section className="columns">
      <div className="column my-list">
        <h1 className="title"> Groups </h1>
        {groupUids.map(groupUid => <Link
          to={Routes.groupMessages(groupUid)}
          className="my-list-item"> 
          {groupUid}
        </Link>)}
      </div>
      <div className="column my-list">
        <h1 className="title"> Stories </h1>
        {storyUids.map(storyUid => <Link
          to={Routes.storyMessages(storyUid)}
          className="my-list-item"> 
          {storyUid}
        </Link>)}
      </div>
    </section>
  </section>
))
