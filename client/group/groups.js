/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Routes from '../routes'
import { getGroupsList } from '../reducers'

const stateToProps = (state) => ({
  groupList: getGroupsList(state),
})

const Groups = ({groupList}) => {
  const groups = groupList.map(group => {
      return (
            <tr key={group.uid}>
              <td><Link to={Routes.groupMessages(group.uid)}>{group.uid}</Link></td>
                <td><Link to={Routes.storyMessages(group.storyUid)}>{group.storyUid}</Link></td>
                <td>{group.clueUid}</td>
                <td>{group.createdAt}</td>
                <td>{group.completedAt}</td>
                <td>
                  <Link
                    to={Routes.groupMessages(group.uid)}
                    className="button has-margin-5 is-primary"> 
                    View Transcript
                  </Link>
                  <a className="button has-margin-5 is-success">Restart Group</a>
                  <a className="button has-margin-5 is-danger">End Group</a>
                </td>
            </tr>
          )
  })

  return (
    <div>
      <h1 className="title">Groups</h1>
      <div className="my-list">
          <table className="table is-bordered is-striped group__table">
          <thead>
            <tr>
              <th>Group Code</th>
              <th>Story Code</th>
              <th>Current Clue</th>
              <th>Date Started</th>
              <th>Date Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups}
          </tbody>
          </table>
        </div>
    </div>
  )
}

Groups.propTypes = {
  group: React.PropTypes.object,
  groupList: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}

export default connect(stateToProps)(Groups)
