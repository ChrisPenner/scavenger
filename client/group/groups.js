/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Routes from '../routes'
import { getGroupList } from '../reducers'

const stateToProps = (state) => ({
  groupList: getGroupList(state),
})

const Groups = ({groupList}) => {
  const groups = groupList.map(group => (
    <Link
      key={group.uid}
      className="my-list-item">
      {group.uid}
    </Link>
  ))

  return (
    <div>
      <h1 className="title">Groups</h1>
      <div className="my-list">
          {groups}
        </div>
    </div>
  )
}

Groups.propTypes = {
  group: React.PropTypes.object,
  groupList: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}

export default connect(stateToProps)(Groups)
