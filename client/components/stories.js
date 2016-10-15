/* @flow */
import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import loadGuard from '../lib/loaded'

import * as Routes from '../routes'
import { Story } from '../resources'

import type { StoryType } from '../resources'

const stateToProps = (state) => ({
  stories: Story.selectors.getAll(state),
})

const dispatchProps = {
}

type StoriesProps = {
  stories: {[key: string]: StoryType},
}

const Stories = ({stories}: StoriesProps) => {
  const storiesList = R.map((story => (
    <Link
      key={story.uid}
      to={Story.route(story.uid)}
      className="my-list-item">
      {story.uid}
    </Link>
  )), R.values(stories))

  return (
    <div>
      <h1 className="title">Stories</h1>
      <div className="my-list">
          {storiesList}
          <Link
            key="add-story"
            to={Routes.createStory()}
            className="my-list-item"> + Add Story
          </Link>
        </div>
    </div>
  )
}

export default R.compose(
  loadGuard([Story.type]),
  connect(stateToProps, dispatchProps),
)(Stories)
