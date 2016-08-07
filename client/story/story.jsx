import { connect } from 'react-redux'
import { Link } from 'react-router'

import Routes, { CREATE } from 'routes'
import { getStory, getClue, getCluesByStory } from 'reducers'
import { changeStory, saveStory} from 'actions'

const stateToProps = (state, {params:{storyUid}}) => {
    return {
        story: getStory(state, storyUid),
    }
}
const Story = ({ story, changeStory, children, saveStory }) =>{
    const clueLinks = story.clues.map(clueUid => (
        <Link
            key={clueUid}
            to={Routes.clue(clueUid)}
            className="list-group-item">
            <span className="text-info">{clueUid}</span>
        </Link>))
    return (
        <div>
            <div className="row">
                <div className="col-xs-12 col-sm-3">
                    <div className="panel panel-info">
                        <div className="panel-heading">
                            {story.uid}
                        <a
                            className="pull-right"
                            onClick={() => saveStory(story.uid)}>
                            Save
                        </a>
                        </div>
                        <div className="panel-body">
                            <div className="form-group">
                                <label htmlFor="default-hint"> Default Hint: </label>
                                <input
                                    id="default-hint"
                                    className="form-control"
                                    value={story.defaultHint || ''}
                                    onChange={(e) => changeStory([story.uid, 'defaultHint'], e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-3">
                    <div className="panel panel-warning">
                        <div className="panel-heading">
                            Clues
                        </div>
                        <div className="panel-body">
                            <div className="list-group">
                                {clueLinks}
                                <Link to={{ pathname: Routes.clue(CREATE), query: {storyUid: story.uid}}} className="list-group-item list-group-item-warning">
                                    + Add Clue
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

Story.propTypes = {
    story: React.PropTypes.object.isRequired,
    changeStory: React.PropTypes.func.isRequired,
    saveStory: React.PropTypes.func.isRequired,
    children: React.PropTypes.element.isRequired,
}
export default connect(stateToProps, { changeStory, saveStory})(Story)
