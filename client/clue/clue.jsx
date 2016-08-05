import {connect} from 'react-redux'
import {Link} from 'react-router'
import Routes, {CREATE} from 'routes'
import * as Res from 'resources'
import {Answer} from 'answer'
import {getClue, getAnswersListByClue, getCluesListByStory, getAnswer} from 'reducers'
import {changeClue, saveClue, addAnswer} from 'actions'
import {push} from 'react-router-redux'

const Clue = ({clue, answers, changeClue, saveClue}) => {
    const answerView = answers.map(answer => (
                <Answer key={answer.uid} answerId={answer.uid} />
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
        <Link to={{ pathname: Routes.answer(CREATE), query: {storyId: clue.storyId, clueId: clue.clueId}}} 
            className="btn btn-primary">
                Add Answer
            </Link>
        </div>
    </div>
    )
}
const clueProps = (state, props) => {
    const {clueId} = props.params
    return {
        clue: getClue(state, clueId),
        answers: getAnswersListByClue(state, clueId),
    }
}
export default connect(clueProps, { saveClue, changeClue })(Clue)
