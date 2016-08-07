import { connect } from 'react-redux'
import { Link } from 'react-router'

import Routes, { CREATE } from 'routes'
import { getStory, getClue, getCluesByStory, uidsFromParams} from 'reducers'
import { changeStory, saveStory} from 'actions'

const stateToProps = (state, {params}) => {
    const {storyUid} = uidsFromParams(params)
    return {
        story: getStory(state, storyUid),
    }
}
const Story = ({ story, changeStory, saveStory }) =>{
    return (
        <div>
            <div className="row">
                <div className="col">
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
            </div>
        </div>
    )
}

Story.propTypes = {
    story: React.PropTypes.object.isRequired,
    changeStory: React.PropTypes.func.isRequired,
    saveStory: React.PropTypes.func.isRequired,
}
export default connect(stateToProps, { changeStory, saveStory})(Story)
