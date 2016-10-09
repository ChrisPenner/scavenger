/* @flow */
import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import loadGuard from '../lib/loaded'

import { Story } from '../resources'
import { uidsFromParams } from '../utils'
import { getStory } from '../reducers'
import { changeStory, saveStory } from '../actions'
import { Clues } from '../clue'

import type { StoryType } from '../resources'

const stateToProps = (state, {params}) => {
  const {storyUid} = uidsFromParams(params)
  return {
    story: getStory(state, storyUid),
  }
}

const dispatchProps = {
  changeStory,
  saveStory,
}

type StoryProps = {
  story: StoryType,
  changeStory: Function,
  saveStory: Function,
}

const StoryComponent = ({story, changeStory, saveStory}: StoryProps) => {
  return (
    <section className="notification is-info">
      <h2> Story </h2>
      <h1 className="title">
        {story.uid}
      </h1>
      <div className="level">
        <button
          className="button is-success level-item"
          onClick={() => saveStory(story.uid)}>
          Save
        </button>
      </div>
      <label className="label">
        Default Hint
      </label>
      <div className="control">
        <input
          id="default-hint"
          className="input"
          value={story.defaultHint || ''}
          onChange={(e) => changeStory([story.uid, 'defaultHint'], e.target.value)} />
      </div>
      <label className="label">
        Ending Message
      </label>
      <div className="control">
        <textarea
          id="end-message"
          className="textarea"
          value={story.endMessage || ''}
          onChange={(e) => changeStory([story.uid, 'endMessage'], e.target.value)} />
      </div>

      <label className="label">
        Clues
      </label>
      <Clues storyUid={story.uid} />
    </section>
  )
}

export default R.compose(
  loadGuard([Story.type]),
  connect(stateToProps, dispatchProps)
)(StoryComponent)
