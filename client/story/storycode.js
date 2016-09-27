/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Routes from '../routes'
import { getStoryCodeList } from '../reducers'

const stateToProps = (state) => ({
	storyCodes: getStoryCodeList(state),
})

const StoryCode = ({storyCodes}) => {
	const codes = storyCodes.map(storyCode => {
      return (
            <tr key={storyCode.uid}>
                <td>{storyCode.storyUid}</td>
                <td>{storyCode.wordString}</td>
                <td>{storyCode.used}</td>
                <td>{storyCode.singleUse}</td>
            </tr>
          )
  })
  return (
     <section>
     	<h1 className="title">Story Codes</h1>
     	<table className="table is-bordered is-striped group__table">
          <thead>
            <tr>
              <th>Story Code</th>
              <th>Word String</th>
              <th>Used</th>
              <th>Single Use</th>
            </tr>
          </thead>
          <tbody>
            {codes}
          </tbody>
          </table>
     </section>
  )
}

StoryCode.propTypes = {
  storyCode: React.PropTypes.object,
  storyCodes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}

export default connect(stateToProps)(StoryCode)
