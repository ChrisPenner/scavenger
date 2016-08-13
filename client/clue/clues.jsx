import {connect} from 'react-redux'
import { Link } from 'react-router'

import { getCluesListByStory, uidsFromParams } from 'reducers'
import Routes from 'routes'

const stateToProps = (state, {storyUid}) => {
    return {
        clues: getCluesListByStory(state, storyUid),
        storyUid,
    }
}

const Clues = ({clues, storyUid}) => {
    const clueLinks = clues.map(clue => (
        <tr key={clue.uid}>
            <td>
                <Link to={Routes.clue(clue.uid)}>
                    {clue.uid}
                </Link>
            </td>
        </tr>))
    return (
        <table className="table is-bordered">
            <tbody>
                {clueLinks}
                <tr key="addClue">
                    <td>
                        <Link to={{ pathname: Routes.createClue(storyUid)}}>
                            + Add Clue
                        </Link>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
Clues.propTypes = {
    clues: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    storyUid: React.PropTypes.string.isRequired,
}
export default connect(stateToProps)(Clues)




