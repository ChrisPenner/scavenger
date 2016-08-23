/* @flow */
import React from 'react'
import R from 'ramda'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import * as Routes from '../routes'
import { getAnswer, getClueUidsByStory, splitUid, uidsFromParams } from '../reducers'
import { changeAnswer, saveAnswer, deleteAnswer } from '../actions'

const Answer = ({answer, clueUids, changeAnswer, saveAnswer, deleteAnswer}) => {
  let patternError
  try {
    new RegExp(answer.pattern)
  } catch(err) {
    patternError = err
  }

  return (
    <div className="message is-danger">
      <div className="message-header is-marginless level is-mobile">
        <span className="level-item">
          {answer.uid}
        </span>
        <button
          className="button is-danger is-narrow level-item"
          onClick={() => deleteAnswer(answer.uid)}>
          Delete
        </button>
        <button
          className="button is-success is-narrow level-item"
          onClick={() => saveAnswer(answer.uid)}>
          Save
        </button>
      </div>
      <div className="message-body">
        <label
          className="label"
          htmlFor="pattern">
          Pattern
        </label>
        <div className="control">
          <input
            id="pattern"
            className={classnames('input', {
              'is-danger': patternError,
            })}
            value={answer.pattern || ''}
            onChange={(e) => changeAnswer([answer.uid, 'pattern'], e.target.value)} />
        </div>
        {patternError && <span className="help is-danger">{String(patternError)}</span>}

        <label
          className="label"
          htmlFor="receiver">
          Receiver <span className="faded"> (optional) </span>
        </label>
        <div className="control">
          <input
            id="receiver"
            className="input"
            value={answer.receiver || ''}
            placeholder="Only messages to this number will match"
            onChange={(e) => changeAnswer([answer.uid, 'receiver'], e.target.value)} />
        </div>

        <label
          className="label"
          htmlFor="next-clue">
          Next Clue
        </label>
        <div className="control select">
          <select
            id="next-clue"
            value={answer.nextClue}
            onChange={(e) => changeAnswer([answer.uid, 'nextClue'], e.target.value)}>
            {clueUids.map(clueUid => <option
              key={clueUid}
              value={clueUid}>
              {clueUid}
            </option>)}
          </select>
        </div>
      </div>
    </div>
  )
}

Answer.propTypes = {
  answer: React.PropTypes.object.isRequired,
  clueUids: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  changeAnswer: React.PropTypes.func.isRequired,
  saveAnswer: React.PropTypes.func.isRequired,
  deleteAnswer: React.PropTypes.func.isRequired,
}

const stateToProps = (state, {params}) => {
  const {answerUid} = uidsFromParams(params)
  const answer = getAnswer(state, answerUid)
  return {
    answer,
    clueUids: getClueUidsByStory(state, answer.storyUid)
  }
}

export default connect(stateToProps, {
  changeAnswer,
  saveAnswer,
  deleteAnswer: (uid) => (dispatch) => {
    const { clueUid } = splitUid(uid)
    dispatch(push(Routes.clue(clueUid)))
    dispatch(deleteAnswer(uid))
  },
})(Answer)
