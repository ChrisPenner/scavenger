import { connect } from 'react-redux'
import { getStory, getClue, getCluesByStory } from 'reducers'
import { changeStory, addClue, saveStory} from 'actions'

import { addResourceModal } from 'workflow'
const addClueModal = addResourceModal('Clue', addClue, getClue, (uid) => push(Routes.clue(uid)))

const stateToProps = (state, {params:{storyID}}) => {
    return {
        story: getStory(state, storyID),
        clues: getCluesByStory(state, storyID),
        loading: state.loading,
    }
}
export default connect(stateToProps, { changeStory, addClueModal, saveStory})
(({ story, clues, changeStory, children, addClueModal, saveStory }) =>{
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
                <button onClick={() => addClueModal({story_id: story.uid})} className="btn btn-primary"> Add Clue </button>
            </div>
        </div>
    )
})
