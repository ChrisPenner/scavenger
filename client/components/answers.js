/* @flow */
import React from 'react'
import R from 'ramda'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import classnames from 'classnames'
import loadGuard from '../lib/loaded'

import { getAnswersListByClue } from '../selectors'
import { startDragAnswer, dropAnswer } from '../actions'
import { Answer } from '../resources'
import type { AnswerType } from '../resources'
import * as Routes from '../routes'

const stateToProps = (state, {clueUid}) => {
  return {
    answers: getAnswersListByClue(state, clueUid),
    clueUid,
  }
}

const dispatchProps = {
  startDragAnswer,
  dropAnswer
}

type AnswersProps = {
  startDragAnswer: Function,
  dropAnswer: Function,
  answers: Array<AnswerType>,
  clueUid: string,
  highlightUid: string,
}

const Answers = ({answers, clueUid, startDragAnswer, dropAnswer, highlightUid}: AnswersProps) => {
  const answerLinks = answers.map((answer, index) => {
    const classes = classnames('my-list-item', {
      'highlighted': highlightUid === answer.uid,
    })
    return (
      <Link
        to={Answer.route(answer.uid)}
        className={classes}
        key={answer.uid}
        draggable="true"
        onDragStart={() => startDragAnswer(answer.uid)}
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
        to={{ pathname: Routes.createAnswer(clueUid) }}> + Add Answer
      </Link>
    </div>
  )
}

export default R.compose(
  connect(stateToProps, dispatchProps),
  loadGuard([Answer.type])
)(Answers)
