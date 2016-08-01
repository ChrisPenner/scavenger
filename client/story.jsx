import { Link } from 'react-router'
import {connect} from 'react-redux'
import { push } from 'react-router-redux'

import {changeStory, addStory, addClue, saveStory } from './actions'
import Routes from './routes'
import * as Res from './resources'
import { addResourceModal } from './workflow'
import { getClue, getStory, getStoriesList, getCluesByStory } from './reducers'

const addStoryModal = addResourceModal( 'Story', addStory, getStory, (uid) => push(Routes.story(uid)))
const addClueModal = addResourceModal('Clue', addClue, getClue, (uid) => push(Routes.clue(uid)))

const StoriesView  = ({story, storiesList, addStoryModal}) => {
    if (story){
        return <Story story={story} />
    }

    const stories = storiesList.map(story =>(
        <div key={story.uid}>
            <Link to={`/stories/${story.uid}`}> {story.uid} </Link>
        </div>
    ))

    return (
        <div> My Stories:
            {stories}
            <br/>
            <button onClick={() => addStoryModal()} className="btn btn-primary"> Add Story </button>
        </div>
    )
}
const storiesProps = (state) => {
    return {
        storiesList: getStoriesList(state),
        loading: state.loading,
    }
}

const Stories = connect(storiesProps, {addStoryModal})(StoriesView)

const StoryView = ({ story, clues, changeStory, children, addClueModal, saveStory }) =>{
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
}

const storyProps = (state, {params:{storyID}}) => {
    return {
        story: getStory(state, storyID),
        clues: getCluesByStory(state, storyID),
        loading: state.loading,
    }
}

const Story = connect(storyProps, { changeStory, addClueModal, saveStory })(StoryView)

export {
    Story,
    Stories,
}
