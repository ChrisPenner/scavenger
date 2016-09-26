/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Routes from '../routes'
import { getStoryCode } from '../reducers'

const stateToProps = (state) => ({
	storyCodes: getStoryCode(state),
})

const StoryCode = ({storyCodes}) => {
  return (
     <section className="notification is-info">
     	<h1>Story Codes</h1>
     </section>
  )
}

StoryCode.propTypes = {
  storyCodes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}

export default connect(stateToProps)(StoryCode)
