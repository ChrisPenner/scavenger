import {connect} from 'react-redux'
import {getAnswer, getClues} from './reducers'
const Answer = ({answer, clueIDs}) => (
    <div className="input-group">
        <label>Pattern
            <input
                className="form-control"
                type="text"
                value={answer.pattern}
            />
        </label>
        <label>Next Clue
            <select
                className="form-control"
                value={answer.next_clue}
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
export default connect(answerProps)(Answer)
