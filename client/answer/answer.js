/* @flow */
import React from 'react'
import R from 'ramda'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { splitUid, uidsFromParams } from '../utils'
import { getAnswer, getClueUidsByStory } from '../reducers'
import { changeAnswer, saveAnswer, deleteAnswer } from '../actions'
import { Clue } from '../resources'

const Answer = ({answer, clueUids, changeAnswer, saveAnswer, deleteAnswer}) => {
  let patternError
  try {
    new RegExp(answer.pattern)
  } catch(err) {
    patternError = err
  }

  return (
      <section className="notification is-primary">
        <h2 className="subtitle"> Answer </h2>
        <h1 className="title">
          {answer.uid}
        </h1>
        <div className="level">
          <button
            className="button is-danger level-item"
            onClick={() => deleteAnswer(answer.uid)}>
            Delete
          </button>
          <button
            className="button is-success level-item"
            onClick={() => saveAnswer(answer.uid)}>
            Save
          </button>
        </div>
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

        <p className="control">
          <label
            htmlFor="require-media">
            <input
              id="require-media"
              type="checkbox"
              checked={answer.requireMedia || false}
              onChange={(e) => changeAnswer([answer.uid, 'requireMedia'], e.target.checked)} />
            Require Media
          </label>
        </p>

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
      </section>
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
  const {storyUid, answerUid} = uidsFromParams(params)
  return {
    answer: getAnswer(state, answerUid),
    clueUids: getClueUidsByStory(state, storyUid)
  }
}

export default connect(stateToProps, {
  changeAnswer,
  saveAnswer,
  deleteAnswer: (uid) => deleteAnswer(uid, Clue.route(splitUid(uid).clueUid)),
})(Answer)
