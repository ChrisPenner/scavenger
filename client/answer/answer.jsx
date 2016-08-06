import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {getAnswer, getClueUidsByStory, splitUid} from 'reducers'
import {changeAnswer, saveAnswer} from 'actions'

const getAnswerId = R.compose(R.prop('answerId'), splitUid)

const stateToProps = (state, {answerUid}) => {
    const answer = getAnswer(state, answerUid)
    return {
        answer,
        clueUids: getClueUidsByStory(state, answer.storyUid)
    }
}

const Answer = ({answer, clueUids, changeAnswer}) => (
    <div>
        <h4> {getAnswerId(answer.uid)} &nbsp; <a className="" onClick={() => saveAnswer(answer.uid)}>save</a></h4>
        <div className="input-group">
            <label>Pattern
                <input
                    className="form-control"
                    type="text"
                    value={answer.pattern}
                    onChange={(e) => changeAnswer(answer.uid, 'pattern', e.target.value)}
                />
            </label>
            <label>Next Clue
                <select
                    className="form-control"
                    value={answer.nextClue}
                    onChange={(e) => changeAnswer(answer.uid, 'nextClue', e.target.value)}
                    >
                        {clueUids.map(clueUid=><option key={clueUid} value={clueUid}>{clueUid}</option>)}
                    </select>
            </label>
        </div>
    </div>
)
Answer.propTypes = {
    answer: React.PropTypes.object.isRequired,
    clueUids: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    changeAnswer: React.PropTypes.func.isRequired,
}
export default connect(stateToProps, {changeAnswer, saveAnswer})(Answer)

