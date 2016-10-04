/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Routes from '../routes'
import { getStoriesList } from '../reducers'
import { Story } from '../resources'

import type { StoryType } from '../resources'

const stateToProps = (state) => ({
  storiesList: getStoriesList(state),
})

type StoriesProps = {
  storiesList: Array<StoryType>,
}

const Stories = ({storiesList}: StoriesProps) => {
  const stories = storiesList.map(story => (
    <Link
      key={story.uid}
      to={Story.route(story.uid)}
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

export default connect(stateToProps)(Stories)
