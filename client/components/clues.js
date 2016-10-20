/* @flow */
import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import loadGuard from '../lib/loaded'
import { getCluesByStory } from '../selectors'
import * as Routes from '../routes'
import { startDragClue, dropClue } from '../actions'
import { Clue } from '../resources'
import type { ClueType } from '../resources'

const stateToProps = (state, {storyUid}) => {
  return {
    clues: getCluesByStory(state, storyUid),
    storyUid,
  }
}

const dispatchProps = {
  startDragClue,
  dropClue
}

type CluesProps = {
  clues: Array<ClueType>,
  storyUid: string,
  startDragClue: Function,
  dropClue: Function,
}

const Clues = ({clues, storyUid, startDragClue, dropClue}: CluesProps) => {
  const clueLinks = clues.map((clue, index) => (
    <Link
      key={clue.uid}
      to={Clue.route(clue.uid)}
      className="my-list-item"
      draggable="true"
      onDragStart={() => startDragClue(clue.uid)}
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

export default R.compose(
  loadGuard([Clue.type]),
  connect(stateToProps, dispatchProps)
)(Clues)



