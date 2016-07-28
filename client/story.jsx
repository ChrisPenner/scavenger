import uuid from 'uuid4'
import merge from 'lodash/merge'
import { Link } from 'react-router'
import {connect} from 'react-redux'

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

const StoryView = ({story, clues}) =>{
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
                <input value={story.default_hint || ''} />
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
const Story = connect(storyProps)(StoryView)

export {
    Story,
    Stories,
}
