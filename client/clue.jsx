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
                        <Link to={Routes.clue(clue.uid)}> {clue.uid} </Link>
                    </div>
    ))
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

const Clue = ({clue, answers, changeClue, saveClue}) => {
    const answerView = answers.map(answer => (
                <Answer key={answer.uid} answerID={answer.uid} />
                ))
    return (
        <div key={clue.uid} className="panel panel-info">
            <div className="panel-heading">
                {clue.uid}
                <a className="pull-right" onClick={() => save(clue.uid)} >Save</a>
            </div>
            <div className="panel-body">
            <label>
                Text:
                <input
                    value={clue.text || ''}
                    onChange={(e)=>changeClue(clue.uid, 'text', e.target.value)}
                />
            </label>
            <br/>
            <label>
                Hint:
                <input
                    value={clue.hint || ''}
                    onChange={(e)=>changeClue(clue.uid, 'hint', e.target.value)}
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
export default connect(clueProps, { saveClue, changeClue })(Clue)
