import {connect} from 'react-redux'
import {Link} from 'react-router'
import Routes, {CREATE} from 'routes'
import * as Res from 'resources'
import {Answer} from 'answer'
import {getClue, getAnswersListByClue, getCluesListByStory, getAnswer} from 'reducers'
import {changeClue, saveClue, addAnswer} from 'actions'
import {push} from 'react-router-redux'

const stateToProps = (state, props) => {
    const {clueUid} = props.params
    return {
        clue: getClue(state, clueUid),
        answers: getAnswersListByClue(state, clueUid),
    }
}
const Clue = ({clue, answers, changeClue, saveClue}) => {
    const answerView = answers.map(answer => (
                <Answer key={answer.uid} answerUid={answer.uid} />
                ))
    return (
        <div key={clue.uid} className="panel panel-info">
            <div className="panel-heading">
                {clue.uid}
                <a className="pull-right" onClick={() => saveClue(clue.uid)} >Save</a>
            </div>
            <div className="panel-body">
            <label>
                Text:
                <input
                    value={clue.text || ''}
                    onChange={(e)=>changeClue([clue.uid, 'text'], e.target.value)}
                />
            </label>
            <br/>
            <label>
                Hint:
                <input
                    value={clue.hint || ''}
                    onChange={(e)=>changeClue([clue.uid, 'hint'], e.target.value)}
                />
            </label>
            <h4>Answers </h4>
            {answerView.length > 0
                ? answerView
                : <div> No Answers for this clue.</div>
            }
        <Link to={{ pathname: Routes.answer(CREATE), query: {storyUid: clue.storyUid, clueUid: clue.uid}}}
            className="btn btn-primary">
                Add Answer
            </Link>
        </div>
    </div>
    )
}
Clue.propTypes = {
    clue: React.PropTypes.object.isRequired,
    answers: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    changeClue: React.PropTypes.func.isRequired,
    saveClue: React.PropTypes.func.isRequired,
}
export default connect(stateToProps, { saveClue, changeClue })(Clue)
