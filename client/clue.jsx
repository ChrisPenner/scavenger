import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as Res from './resources'
import Answer from './answer'
import {getClue, getAnswersListByClue} from './reducers'
import {changeClue} from './actions'
const Clue = ({clue, answers, onChangeClue}) => {
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
                    onChange={(e)=>onChangeClue('text', e.target.value)}
                />
            </label>
            <br/>
            <label>
                Hint:
                <input
                    value={clue.hint || ''}
                    onChange={(e)=>onChangeClue('hint', e.target.value)}
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
        answers: getAnswersListByClue(state, clueID),
    }
}
const clueActions = (dispatch, {params:{clueID}}) => {
    return bindActionCreators({
        onChangeClue: changeClue(clueID),
    }, dispatch)
}
export default connect(clueProps, clueActions)(Clue)
