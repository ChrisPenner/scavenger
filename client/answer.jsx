import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {getAnswer, getClues} from 'reducers'
import {changeAnswer} from 'actions'
const Answer = ({answer, clueIDs, changeAnswer}) => (
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
                value={answer.next_clue}
                onChange={(e) => changeAnswer(answer.uid, 'next_clue', e.target.value)}
                >
                    {clueIDs.map(clueID=><option key={clueID} value={clueID}>{clueID}</option>)}
                </select>
        </label>
    </div>
)
const answerProps = (state, {answerID}) => {
    const answer = getAnswer(state, answerID)
    return {
        answer,
        clueIDs: Object.keys(getClues(state, answer.clue_id)),
    }
}

export default connect(answerProps, {changeAnswer})(Answer)
