import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {getAnswer, getClueUidsByStory, splitUid, uidsFromParams} from 'reducers'
import {changeAnswer, saveAnswer} from 'actions'

const getAnswerId = R.compose(R.prop('answerId'), splitUid)

const stateToProps = (state, {params}) => {
    const {answerUid} = uidsFromParams(params)
    const answer = getAnswer(state, answerUid)
    return {
        answer,
        clueUids: getClueUidsByStory(state, answer.storyUid)
    }
}

const Answer = ({answer, clueUids, changeAnswer, saveAnswer}) => (
    <div className="panel panel-danger">
        <div className="panel-heading">
            {answer.uid}
            <a
                className="pull-right"
                onClick={() => saveAnswer(answer.uid)}>
                Save
            </a>
        </div>
        <div className="panel-body">
            <div className="form-group">
                <label htmlFor="pattern"> Pattern </label>
                <input
                    id="pattern"
                    className="form-control"
                    value={answer.pattern || ''}
                    onChange={(e) => changeAnswer([answer.uid, 'pattern'], e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="next-clue"> Next Clue </label>
                <select
                    id="next-clue"
                    className="form-control"
                    value={answer.nextClue}
                    onChange={(e) => changeAnswer([answer.uid, 'nextClue'], e.target.value)}
                >
                    {clueUids.map(clueUid=><option key={clueUid} value={clueUid}>{clueUid}</option>)}
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
export default connect(stateToProps, {changeAnswer, saveAnswer})(Answer)
