/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Routes from '../routes'
import { getStoriesList } from '../reducers'

const stateToProps = (state) => ({
  storiesList: getStoriesList(state),
})

const Stories = ({storiesList}) => {
  const stories = storiesList.map(story => (
    <Link
      key={story.uid}
      to={Routes.story(story.uid)}
      className="my-list-item">
      {story.uid}
    </Link>
  ))

  return (
    <div>
      <h1 className="title">Stories</h1>
      <div className="my-list">
          {stories}
          <Link
            key="add-story"
            to={Routes.createStory()}
            className="my-list-item"> + Add Story
          </Link>
        </div>
    </div>
  )
}

Stories.propTypes = {
  story: React.PropTypes.object,
  storiesList: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}

export default connect(stateToProps)(Stories)
