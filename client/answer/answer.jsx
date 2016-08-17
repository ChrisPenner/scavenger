import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Routes from 'routes'
import { getAnswer, getClueUidsByStory, splitUid, uidsFromParams } from 'reducers'
import { changeAnswer, saveAnswer, deleteAnswer } from 'actions'

const Answer = ({answer, clueUids, changeAnswer, saveAnswer, deleteAnswer}) => (
  <div className="message is-danger">
    <div className="message-header level is-marginless">
      {answer.uid}
      <button
        className="button is-danger is-pulled-right"
        onClick={() => deleteAnswer(answer.uid)}>
        Delete
      </button>
      <button
        className="button is-success is-pulled-right"
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
          className="input"
          value={answer.pattern || ''}
          onChange={(e) => changeAnswer([answer.uid, 'pattern'], e.target.value)} />
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
Answer.propTypes = {
  answer: React.PropTypes.object.isRequired,
  clueUids: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  changeAnswer: React.PropTypes.func.isRequired,
}

const getAnswerId = R.compose(R.prop('answerId'), splitUid)

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
    debugger
    dispatch(deleteAnswer(uid))
  },
})(Answer)
