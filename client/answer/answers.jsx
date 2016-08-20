/* @flow */
import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { getAnswersListByClue, splitUid } from '../reducers'
import Routes from '../routes'
import { startDrag, dropAnswer } from '../actions'

const Answers = ({answers, storyId, clueId, startDrag, dropAnswer}) => {
  const answerLinks = answers.map((answer, index) => (
    <tr key={answer.uid}>
      <td
        draggable="true"
        onDrag={() => startDrag(answer.uid)}
        onDrop={() => dropAnswer(index)}
        onDragOver={(e) => e.preventDefault()}
      >
        <Link to={Routes.answer(answer.uid)}>
        {answer.uid}
        </Link>
      </td>
    </tr>))
  return (
    <table className="table is-bordered">
      <tbody>
        {answerLinks}
        <tr key="addAnswer">
          <td>
            <Link to={{ pathname: Routes.createAnswer(storyId, clueId) }}> + Add Answer
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
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
}
export default connect(stateToProps, { startDrag, dropAnswer })(Answers)
