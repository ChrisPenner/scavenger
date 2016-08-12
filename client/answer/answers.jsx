import {Link} from 'react-router'
import {connect} from 'react-redux'
import { getAnswersListByClue, splitUid } from 'reducers'
import Routes, {CREATE} from 'routes'

const stateToProps = (state, {clueUid}) => {
    const {clueId, storyId} = splitUid(clueUid)
    return {
        answers: getAnswersListByClue(state, clueUid),
        storyId,
        clueId,
    }
}

const Answers = ({answers, storyId, clueId}) => {
    const answerLinks = answers.map(answer => (
        <Link
            key={answer.uid}
            to={Routes.answer(answer.uid)}
            className="list-group-item">
            <span className="text-info">{answer.uid}</span>
        </Link>))
    return (
        <div className="list-group">
            {answerLinks}
            <Link to={{ pathname: Routes.createAnswer(storyId, clueId)}} className="list-group-item list-group-item-success">
                + Add Answer
            </Link>
        </div>
    )
}

export default connect(stateToProps)(Answers)
