import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {getAnswer, getClues} from 'reducers'
import {changeAnswer} from 'actions'

const stateToProps = (state, {answerId}) => {
    const answer = getAnswer(state, answerId)
    return {
        answer,
        clueIds: Object.keys(getClues(state, answer.clueId)),
    }
}
export default connect(stateToProps, {changeAnswer})(
({answer, clueIds, changeAnswer}) => (
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
                    {clueIds.map(clueId=><option key={clueId} value={clueId}>{clueId}</option>)}
                </select>
        </label>
    </div>
))

