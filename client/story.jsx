import { Link } from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {changeStory, addStory} from './actions'
import {Clues} from './clue'
import Routes from './routes'
import * as Res from './resources'
import { addResourceModal } from './workflow'
import {getStory, getStoriesList, getCluesByStory} from './reducers'

const StoriesView  = ({story, storiesList, addStory}) => {
    if (story){
        return <Story story={story} />
    }

    const stories = storiesList.map(story =>(
        <div key={story.uid}>
            <Link to={`/stories/${story.uid}`}> {story.uid} </Link>
        </div>
    ))
    console.log(stories)

    return (
        <div> My Stories:
            {stories}
            <br/>
            <button onClick={addStory} className="btn btn-primary"> Add Story </button>
        </div>
    )
}
const storiesProps = (state) => {
    return {
        storiesList: getStoriesList(state),
        loading: state.loading,
    }
}

const addStoryModal = addResourceModal('Story', addStory, getStory)
const Stories = connect(storiesProps, {addStory: addStoryModal})(StoriesView)

const StoryView = ({story, clues, onChangeStory, children}) =>{
    return (
        <div>
            <h1>{story.uid}</h1>
            <label>
                Default Hint:
                <input
                    value={story.default_hint || ''}
                    onChange={(e) => onChangeStory('default_hint', e.target.value)}
                />
            </label>
            <div>
                <h2> Clues </h2>
                {children ? children : null}
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

const storyActions = (dispatch, {params:{storyID}}) => {
    return bindActionCreators({
        onChangeStory: changeStory(storyID),
    }, dispatch)
}

const Story = connect(storyProps, storyActions)(StoryView)

export {
    Story,
    Stories,
}
