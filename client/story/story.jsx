import { connect } from 'react-redux'
import { Link } from 'react-router'

import Routes, { CREATE } from 'routes'
import { getStory, getClue, getCluesByStory } from 'reducers'
import { changeStory, saveStory} from 'actions'

const stateToProps = (state, {params:{storyUid}}) => {
    return {
        story: getStory(state, storyUid),
        loading: state.loading,
    }
}
export default connect(stateToProps, { changeStory, saveStory})
(({ story, changeStory, children, saveStory }) =>{
    const clueLinks = story.clues.map(clueUid => <Link key={clueUid} to={Routes.clue(clueUid)}> {clueUid} </Link>)
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
                    value={story.defaultHint || ''}
                    onChange={(e) => changeStory(story.uid, 'defaultHint', e.target.value)}
                />
            </label>
            <div>
                <h2> Clues </h2>
                {clueLinks}
                <br/>
                <Link to={{ pathname: Routes.clue(CREATE), query: {storyUid: story.uid}}} className="btn btn-primary">
                    Add Clue
                </Link>
            </div>
        </div>
    )
})
