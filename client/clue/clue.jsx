/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { push } from 'react-router-redux'

import Routes, { CREATE } from '../routes'
import * as Res from '../resources'
import { Answers } from '../answer'
import { getClue } from '../reducers'
import { changeClue, saveClue, deleteClue } from '../actions'
import { uidsFromParams, splitUid } from '../reducers'

const stateToProps = (state, {params}) => {
  const {clueUid} = uidsFromParams(params)
  return {
    clue: getClue(state, clueUid),
  }
}
const Clue = ({clue, changeClue, saveClue, deleteClue }) => {
  return (
    <div className="message is-warning">
      <div className="message-header level is-marginless">
        {clue.uid}
      <button
        className="button is-danger is-pulled-right"
        onClick={() => deleteClue(clue.uid)}>
        Delete
      </button>
        <button
          className="button is-success is-pulled-right"
          onClick={() => saveClue(clue.uid)}>
          Save
        </button>
      </div>
      <div className="message-body">
        <label
          className="label"
          htmlFor="text">
          Text
        </label>
        <div className="control">
          <input
            id="text"
            className="input"
            value={clue.text || ''}
            onChange={(e) => changeClue([clue.uid, 'text'], e.target.value)} />
        </div>
        <label
          className="label"
          htmlFor="hint">
          Hint:
        </label>
        <div className="control">
          <input
            id="hint"
            className="input"
            value={clue.hint || ''}
            onChange={(e) => changeClue([clue.uid, 'hint'], e.target.value)} />
        </div>
        <label className="label">
          Answers
        </label>
        <Answers clueUid={clue.uid} />
      </div>
    </div>
  )
}
Clue.propTypes = {
  clue: React.PropTypes.object.isRequired,
  changeClue: React.PropTypes.func.isRequired,
  saveClue: React.PropTypes.func.isRequired,
  deleteClue: React.PropTypes.func.isRequired,
}
export default connect(stateToProps, {
  saveClue,
  changeClue,
  deleteClue: (uid) => (dispatch) => {
    const { storyUid } = splitUid(uid)
    dispatch(push(Routes.story(storyUid)))
    dispatch(deleteClue(uid))
  },
})(Clue)
