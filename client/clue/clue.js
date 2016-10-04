/* @flow */
import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import * as Routes from '../routes'
import { Answers } from '../answer'
import { getClue, getAnswersByClue } from '../reducers'
import { changeClue, saveClue, deleteClue, changeTestMessage } from '../actions'
import { getToolData } from '../reducers'
import { uidsFromParams, splitUid } from '../utils'
import { Story } from '../resources'
import type { AnswerType } from '../resources'

const findMatchingAnswer = (text: string, answers: Array<AnswerType>) => {
  const checkMatch = R.compose(R.not, R.isEmpty)
  const matcherFromAnswer = R.compose(R.match, R.prop('pattern'))
  const doesMatchText = (txt) => (answer) => {
    const matcher = matcherFromAnswer(answer)
    return R.compose(checkMatch, matcher)(txt)
  }
  return R.find(doesMatchText(text), answers)
}

const stateToProps = (state, {params}) => {
  const {clueUid} = uidsFromParams(params)
  return {
    clue: getClue(state, clueUid),
    testMessage: getToolData(state).testMessage,
    answers: getAnswersByClue(state, clueUid)
  }
}

const Clue = ({answers, clue, changeClue, saveClue, deleteClue, changeTestMessage, testMessage}) => {
  let matchingAnswer, regexErr
  try {
    matchingAnswer = findMatchingAnswer(testMessage, answers)
  } catch(err) {
    matchingAnswer = null
  }
  const highlightAnswerUid = matchingAnswer && matchingAnswer.uid
  return (
    <section className="notification is-warning">
      <h2 className="subtitle"> Clue </h2>
      <h1 className="title">
        {clue.uid}
      </h1>
      <div className="level">
        <button
          className="button is-danger level-item"
          onClick={() => deleteClue(clue.uid)}>
          Delete
        </button>
        <button
          className="button is-success level-item"
          onClick={() => saveClue(clue.uid)}>
          Save
        </button>
      </div>

      <label
        className="label"
        htmlFor="text">
        Text
      </label>
      <div className="control">
        <textarea
          id="text"
          className="textarea"
          value={clue.text || ''}
          placeholder="The text of the message"
          onChange={(e) => changeClue([clue.uid, 'text'], e.target.value)} />
      </div>

      <label
        className="label"
        htmlFor="hint">
        Hint
      </label>
      <div className="control">
        <textarea
          id="hint"
          className="textarea"
          value={clue.hint || ''}
          placeholder="The text of the hint"
          onChange={(e) => changeClue([clue.uid, 'hint'], e.target.value)} />
      </div>

      <label
        className="label"
        htmlFor="mediaUrl">
        Media Url <span className="faded"> (optional) </span>
      </label>
      <div className="control">
        <input
          id="mediaUrl"
          className="input"
          value={clue.mediaUrl || ''}
          placeholder="e.g. https://placekitten.com/g/300/300"
          onChange={(e) => changeClue([clue.uid, 'mediaUrl'], e.target.value)} />
      </div>

      <label
        className="label"
        htmlFor="sender">
        Sender <span className="faded"> (optional) </span>
      </label>
      <div className="control">
        <input
          id="sender"
          className="input"
          value={clue.sender || ''}
          placeholder="Which number to send the clue from"
          onChange={(e) => changeClue([clue.uid, 'sender'], e.target.value)} />
      </div>

      <hr/>
      <label
        className="label"
        htmlFor="test-message">
        Test a Message
      </label>
      <div className="control">
        <input
          id="test-message"
          className="input"
          value={testMessage}
          placeholder="The matching answer will be highlighted"
          onChange={(e) => changeTestMessage(e.target.value)} />
      </div>
      <label className="label">
        Answers
      </label>
      <Answers highlightUid={highlightAnswerUid} clueUid={clue.uid} />
    </section>
  )
}

Clue.propTypes = {
  clue: React.PropTypes.object.isRequired,
  changeClue: React.PropTypes.func.isRequired,
  saveClue: React.PropTypes.func.isRequired,
  deleteClue: React.PropTypes.func.isRequired,
  changeTestMessage: React.PropTypes.func.isRequired,
  testMessage: React.PropTypes.string.isRequired,
  answers: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}

export default connect(stateToProps, {
  saveClue,
  changeClue,
  deleteClue: (uid) => deleteClue(uid, Story.route(splitUid(uid).storyUid)),
  changeTestMessage,
})(Clue)
