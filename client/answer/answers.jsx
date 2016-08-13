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
        <tr key={answer.uid}>
            <td>
                <Link to={Routes.answer(answer.uid)}>
                    {answer.uid}
                </Link>
            </td>
        </tr>))
    return (
        <table className="table is-bordered">
            <tbody>
                {answerLinks}
                <tr key="addAnswer">
                    <td>
                        <Link to={{ pathname: Routes.createAnswer(storyId, clueId)}}>
                            + Add Answer
                        </Link>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default connect(stateToProps)(Answers)
