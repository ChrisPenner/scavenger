/* @flow */
import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { splitUid } from '../utils'
import { getAnswersListByClue } from '../reducers'
import { startDrag, dropAnswer } from '../actions'
import { Answer } from '../resources'
import * as Routes from '../routes'

const Answers = ({answers, storyUid, clueUid, startDrag, dropAnswer, highlightUid}) => {
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
        onDragStart={() => startDrag(answer.uid)}
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

const stateToProps = (state, {clueUid}) => {
  const {storyUid} = splitUid(clueUid)
  return {
    answers: getAnswersListByClue(state, clueUid),
    storyUid,
    clueUid,
  }
}

Answers.propTypes = {
  startDrag: React.PropTypes.func.isRequired,
  dropAnswer: React.PropTypes.func.isRequired,
  answers: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  storyUid: React.PropTypes.string.isRequired,
  clueUid: React.PropTypes.string.isRequired,
  highlight: React.PropTypes.string,
}
export default connect(stateToProps, {
  startDrag,
  dropAnswer
})(Answers)
