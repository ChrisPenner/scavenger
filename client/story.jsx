import uuid from 'uuid4'
import merge from 'lodash/merge'
import { Link } from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {changeStory} from './actions'

import Routes from './routes'
import * as Res from './resources'
import {getStory, getStoriesList, getCluesByStory} from './reducers'


const StoriesView  = ({story, storiesList}) => {
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
        </div>
    )
}
const storiesProps = (state) => {
    return {
        storiesList: getStoriesList(state),
        loading: state.loading,
    }
}
const Stories = connect(storiesProps)(StoriesView)

const StoryView = ({story, clues, onChangeStory}) =>{
    const cluesView = clues.map(clue=>(
                    <div key={clue.uid}>
                        <Link to={Routes.clue(clue.uid)}> {clue.clue_id} </Link>
                    </div>
                ))
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
                {cluesView}
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
