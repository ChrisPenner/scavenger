import {connect} from 'react-redux'
import { Link } from 'react-router'

import { getCluesListByStory } from 'reducers'
import Routes from 'routes'

const stateToProps = (state, {params:{storyID}}) => {
    return {
        clues: getCluesListByStory(state, storyID),
    }
}

export default connect(stateToProps)(
({clues}) => {
    const cluesView = clues.map(clue=>(
        <div key={clue.uid}>
            <Link to={Routes.clue(clue.uid)}> {clue.clue_id} </Link>
        </div>
    ))
    return (
        <div>
            {cluesView}
        </div>
    )
})
