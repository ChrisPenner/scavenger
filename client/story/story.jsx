import { connect } from 'react-redux'
import { Link } from 'react-router'

import Routes, { CREATE } from 'routes'
import { getStory, getClue, getCluesByStory } from 'reducers'
import { changeStory, saveStory} from 'actions'

const stateToProps = (state, {params:{storyID}}) => {
    return {
        story: getStory(state, storyID),
        clues: getCluesByStory(state, storyID),
        loading: state.loading,
    }
}
export default connect(stateToProps, { changeStory, saveStory})
(({ story, clues, changeStory, children, saveStory }) =>{
    return (
        <div>
            <h1>
                {story.uid}
            </h1>
            <a onClick={() => saveStory(story.uid)}>Save</a>
            <br/>
            <label>
                Default Hint:
                <input
                    value={story.default_hint || ''}
                    onChange={(e) => changeStory(story.uid, 'default_hint', e.target.value)}
                />
            </label>
            <div>
                <h2> Clues </h2>
                {children}
                <br/>
                <Link to={Routes.clue(CREATE)} className="btn btn-primary">
                    Add Clue
                </Link>
            </div>
        </div>
    )
})
