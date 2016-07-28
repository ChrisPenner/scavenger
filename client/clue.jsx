import {connect} from 'react-redux'
import * as Res from './resources'
import Answer from './answer'
import {getClue, getAnswersListByClue} from './reducers'
const Clue = ({clue, answers}) => {
    const answerView = answers.map(answer => (
                <Answer key={answer.uid} answerID={answer.uid} />
                ))
    return (
        <div key={clue.clue_id} className="panel panel-info">
            <div className="panel-heading">
                {clue.clue_id}
            </div>
            <div className="panel-body">
            <label>
                Text:
                <input
                    value={clue.text || ''}
                />
            </label>
            <br/>
            <label>
                Hint:
                <input
                    value={clue.hint || ''}
                />
            </label>
            <h4>Answers </h4>
            {answerView}
        </div>
    </div>
    )
}
const clueProps = (state, props) => {
    const {clueID} = props.params
    return {
        clue: getClue(state, clueID),
        answers: getAnswersListByClue(state, clueID)
    }

}
export default connect(clueProps)(Clue)
