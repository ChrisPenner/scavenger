import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import Routes from './routes'
import {Button} from 'react-bootstrap'
import * as Res from './resources'
import Answer from './answer'
import {getClue, getAnswersListByClue, getCluesListByStory} from './reducers'
import {changeClue, saveClue} from './actions'

const CluesView = ({clues}) => {
    const cluesView = clues.map(clue=>(
                    <div key={clue.uid}>
                        <Link to={Routes.clue(clue.uid)}> {clue.clue_id} </Link>
                    </div>
    ))
    console.log('cluesview', cluesView)
    return (
        <div>
            {cluesView}
        </div>
    )
}
const cluesProps = (state, {params:{storyID}}) => {
    return {
        clues: getCluesListByStory(state, storyID),
    }
}
export const Clues = connect(cluesProps)(CluesView)

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
