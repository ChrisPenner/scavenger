import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {getAnswer, getClueUidsByStory} from 'reducers'
import {changeAnswer} from 'actions'

const stateToProps = (state, {answerUid}) => {
    const answer = getAnswer(state, answerUid)
    return {
        answer,
        clueUids: getClueUidsByStory(state, answer.storyUid)
    }
}
export default connect(stateToProps, {changeAnswer})(
({answer, clueUids, changeAnswer}) => (
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
))

