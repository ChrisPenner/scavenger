/* @flow */
import React from 'react'

import { connect } from 'react-redux'
import { Link } from 'react-router'

import { getCluesByStory } from '../reducers'
import * as Routes from '../routes'

const stateToProps = (state, {storyUid}) => {
  return {
    clues: getCluesByStory(state, storyUid),
    storyUid,
  }
}

const Clues = ({clues, storyUid}) => {
  const clueLinks = clues.map(clue => (
    <Link
      key={clue.uid}
      to={Routes.clue(clue.uid)}
      className="my-list-item">
      {clue.uid}
    </Link>
    ))
  return (
      <div className="my-list">
        {clueLinks}
        <Link
          key="add-clue"
          to={{ pathname: Routes.createClue(storyUid) }}
          className="my-list-item"
        >
          + Add Clue
        </Link>
      </div>
  )
}
Clues.propTypes = {
  clues: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  storyUid: React.PropTypes.string.isRequired,
}
export default connect(stateToProps)(Clues)



