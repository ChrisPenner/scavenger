import { connect } from 'react-redux'
import { Link } from 'react-router'
import Routes, {CREATE} from 'routes'
import { getStoriesList } from 'reducers'

const stateToProps = (state) => ({
    storiesList: getStoriesList(state),
    loading: state.loading,
})
export default connect(stateToProps)(
({story, storiesList}) => {
    if (story){
        return <Story story={story} />
    }

    const stories = storiesList.map(story =>(
        <div key={story.uid}>
            <Link to={Routes.story(story.uid)}> {story.uid} </Link>
        </div>
    ))

    return (
        <div> My Stories:
            {stories}
            <br/>
            <Link to={Routes.story(CREATE)} className="btn btn-primary">
                Add Story
            </Link>
        </div>
    )
})

