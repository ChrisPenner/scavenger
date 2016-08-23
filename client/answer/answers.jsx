/* @flow */
import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { getAnswersListByClue, splitUid } from '../reducers'
import * as Routes from '../routes'
import { startDrag, dropAnswer } from '../actions'

const Answers = ({answers, storyId, clueId, startDrag, dropAnswer, highlightUid}) => {
  const answerLinks = answers.map((answer, index) => {
    const classes = classnames('my-list-item', {
      'highlighted': highlightUid === answer.uid,
    })
    return (
      <Link
        to={Routes.answer(answer.uid)}
        className={classes}
        key={answer.uid}
        draggable="true"
        onDrag={() => startDrag(answer.uid)}
        onDrop={() => dropAnswer(index)}
        onDragOver={(e) => e.preventDefault()}>
      {answer.uid}
      </Link>
    )
  })
  return (
    <div className="my-list">
      {answerLinks}
      <Link
        className="my-list-item"
        key="add-answer"
        to={{ pathname: Routes.createAnswer(storyId, clueId) }}> + Add Answer
      </Link>
    </div>
  )
}

const stateToProps = (state, {clueUid}) => {
  const {clueId, storyId} = splitUid(clueUid)
  return {
    answers: getAnswersListByClue(state, clueUid),
    storyId,
    clueId,
  }
}

Answers.propTypes = {
  startDrag: React.PropTypes.func.isRequired,
  dropAnswer: React.PropTypes.func.isRequired,
  answers: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  storyId: React.PropTypes.string.isRequired,
  clueId: React.PropTypes.string.isRequired,
  highlight: React.PropTypes.string,
}
export default connect(stateToProps, {
  startDrag,
  dropAnswer
})(Answers)
