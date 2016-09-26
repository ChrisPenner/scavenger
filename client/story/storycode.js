/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Routes from '../routes'

const stateToProps = (state) => ({
})

const StoryCode = () => {
  return (
     <section className="notification is-info">
     	<h1>Story Codes</h1>
     </section>
  )
}

StoryCode.propTypes = {
}

export default connect(stateToProps)(StoryCode)
