/* @flow */
import React from 'react'
import { connect } from 'react-redux'

import { uidsFromParams } from '../utils'
import { getStory } from '../reducers'
import { changeStory, saveStory } from '../actions'
import { Clues } from '../clue'

const stateToProps = (state, {params}) => {
  const {storyUid} = uidsFromParams(params)
  return {
    story: getStory(state, storyUid),
  }
}
const Story = ({story, changeStory, saveStory}) => {
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
        Clues
      </label>
      <Clues storyUid={story.uid} />
    </section>
  )
}

Story.propTypes = {
  story: React.PropTypes.object.isRequired,
  changeStory: React.PropTypes.func.isRequired,
  saveStory: React.PropTypes.func.isRequired,
}
export default connect(stateToProps, {
  changeStory,
  saveStory
})(Story)
