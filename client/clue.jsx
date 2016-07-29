import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Button} from 'react-bootstrap'
import * as Res from './resources'
import Answer from './answer'
import {getClue, getAnswersListByClue} from './reducers'
import {changeClue, saveClue} from './actions'
const Clue = ({clue, answers, onChangeClue, save}) => {
    const answerView = answers.map(answer => (
                <Answer key={answer.uid} answerID={answer.uid} />
                ))
    return (
        <div key={clue.clue_id} className="panel panel-info">
            <div className="panel-heading">
                {clue.clue_id}
                <a className="pull-right" onClick={save} >Save</a>
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
            {answerView.length > 0 
                ? answerView
                : <div> No Answers for this clue.</div>
            }
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
        save: saveClue(clueID),
    }, dispatch)
}
export default connect(clueProps, clueActions)(Clue)
