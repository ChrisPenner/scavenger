/* @flow */
import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import loadGuard from '../lib/loaded'

import { getCluesByStory } from '../reducers'
import * as Routes from '../routes'
import { startDrag, dropClue } from '../actions'
import { Clue } from '../resources'
import type { ClueType } from '../resources'

const stateToProps = (state, {storyUid}) => {
  return {
    clues: getCluesByStory(state, storyUid),
    storyUid,
  }
}

const dispatchProps = {
  startDrag,
  dropClue
}

type CluesProps = {
  clues: Array<ClueType>,
  storyUid: string,
  startDrag: Function,
  dropClue: Function,
}

const Clues = ({clues, storyUid, startDrag, dropClue}: CluesProps) => {
  const clueLinks = clues.map((clue, index) => (
    <Link
      key={clue.uid}
      to={Clue.route(clue.uid)}
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

export default R.compose(
  loadGuard([Clue.type]),
  connect(stateToProps, dispatchProps)
)(Clues)



