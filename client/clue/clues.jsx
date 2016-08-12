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
        <Link
            key={clue.uid}
            to={Routes.clue(clue.uid)}
            className="list-group-item">
            <span className="text-info">{clue.uid}</span>
        </Link>))
    return (
        <div className="list-group">
            {clueLinks}
            <Link to={{ pathname: Routes.createClue(storyUid)}} className="list-group-item list-group-item-success">
                + Add Clue
            </Link>
        </div>
    )
}
Clues.propTypes = {
    clues: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    storyUid: React.PropTypes.string.isRequired,
}
export default connect(stateToProps)(Clues)




