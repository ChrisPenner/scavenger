/* @flow */
import React from 'react'
import { connect } from 'react-redux'

import { uidsFromParams } from '../utils'
import { getGroup } from '../reducers'

const stateToProps = (state, {params}) => {
  const {groupUid} = uidsFromParams(params)
  return {
    group: getGroup(state, groupUid),
  }
}
const Group = ({group}) => {
  return (
    <section className="notification is-info">
      <h2> Group </h2>
      <h1 className="title">
        {group.uid}
      </h1>
      Test
    </section>
  )
}

Group.propTypes = {
  group: React.PropTypes.object.isRequired,
}
export default connect(stateToProps, {
})(Group)
