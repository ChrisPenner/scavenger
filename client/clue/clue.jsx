import {connect} from 'react-redux'
import {Link} from 'react-router'
import Routes, {CREATE} from 'routes'
import * as Res from 'resources'
import Answer from 'answer'
import {getClue, getAnswersListByClue, getCluesListByStory, getAnswer} from 'reducers'
import {changeClue, saveClue, addAnswer} from 'actions'
import {addResourceModal} from 'workflow'
import {push} from 'react-router-redux'

const addAnswerModal = addResourceModal('Answer', addAnswer, getAnswer)

const Clue = ({clue, answers, changeClue, saveClue, addAnswerModal}) => {
    const answerView = answers.map(answer => (
                <Answer key={answer.uid} answerID={answer.uid} />
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
            <Link to={Routes.answer(CREATE)} className="btn btn-primary">
                Add Answer
            </Link>
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
export default connect(clueProps, { saveClue, changeClue, addAnswerModal})(Clue)
