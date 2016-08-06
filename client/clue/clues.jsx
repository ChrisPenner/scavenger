import {connect} from 'react-redux'
import { Link } from 'react-router'

import { getCluesListByStory } from 'reducers'
import Routes from 'routes'

const stateToProps = (state, {params:{storyId}}) => {
    return {
        clues: getCluesListByStory(state, storyId),
    }
}

const Clues = ({clues}) => {
    const cluesView = clues.map(clue=>(
        <div key={clue.uid}>
            <Link to={Routes.clue(clue.uid)}> {clue.clueId} </Link>
        </div>
    ))
    return (
        <div>
            {cluesView}
        </div>
    )
}
Clues.propTypes = {
    clues: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}
export default connect(stateToProps)(Clues)
