import {Link} from 'react-router'
import {connect} from 'react-redux'
import {uidsFromParams} from 'reducers'
import { getAnswersListByClue } from 'reducers'
import Routes, {CREATE} from 'routes'

const stateToProps = (state, {clueUid}) => {
    return {
        answers: getAnswersListByClue(state, clueUid),
    }
}

const Answers = ({answers}) => {
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
            <Link to={{ pathname: Routes.answer(CREATE)}} className="list-group-item list-group-item-success">
                + Add Answer
            </Link>
        </div>
    )
}

export default connect(stateToProps)(Answers)
