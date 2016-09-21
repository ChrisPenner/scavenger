/* @flow */
import React from 'react'

import { connect } from 'react-redux'
import { Link } from 'react-router'

import { getCluesByStory } from '../reducers'
import * as Routes from '../routes'
import { startDrag, dropClue } from '../actions'

const stateToProps = (state, {storyUid}) => {
  return {
    clues: getCluesByStory(state, storyUid),
    storyUid,
  }
}

const Clues = ({clues, storyUid, startDrag, dropClue}) => {
  const clueLinks = clues.map((clue, index) => (
    <Link
      key={clue.uid}
      to={Routes.clue(clue.uid)}
      className="my-list-item"
      draggable="true"
      onDragStart={() => startDrag(clue.uid)}
      onDrop={() => dropClue(index)}
      onDragOver={(e) => e.preventDefault()}>
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
  startDrag: React.PropTypes.func.isRequired,
  dropClue: React.PropTypes.func.isRequired,
}
export default connect(stateToProps, {
  startDrag,
  dropClue
})(Clues)



