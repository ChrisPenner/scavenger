import {connect} from 'react-redux'
import { Link } from 'react-router'

import { getCluesListByStory } from 'reducers'
import Routes, {CREATE} from 'routes'
import {uidsFromParams} from 'reducers'

const stateToProps = (state, {params}) => {
    const {storyUid} = uidsFromParams(params)
    return {
        clues: getCluesListByStory(state, storyUid),
        storyUid,
    }
}

const Clues = ({clues}) => {
    const clueLinks = clues.map(clue => (
        <Link
            key={clue.uid}
            to={Routes.clue(clue.uid)}
            className="list-group-item">
            <span className="text-info">{clue.uid}</span>
        </Link>))
    return (
        <div className="col">
            <div className="panel panel-warning">
                <div className="panel-heading">
                    Clues
                </div>
                <div className="list-group">
                    {clueLinks}
                    <Link to={{ pathname: Routes.clue(CREATE)}} className="list-group-item list-group-item-warning">
                        + Add Clue
                    </Link>
                </div>
            </div>
        </div>
    )
}
Clues.propTypes = {
    clues: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}
export default connect(stateToProps)(Clues)




