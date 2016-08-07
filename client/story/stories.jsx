import { connect } from 'react-redux'
import { Link } from 'react-router'
import Routes, {CREATE} from 'routes'
import { getStoriesList } from 'reducers'

const stateToProps = (state) => ({
    storiesList: getStoriesList(state),
})

const Stories = ({story, storiesList}) => {
    if (story){
        return <Story story={story} />
    }

    const stories = storiesList.map(story =>(
        <li key={story.uid}>
            <Link to={Routes.story(story.uid)}> {story.uid} </Link>
        </li>
    ))

    return (
        <div> My Stories:
            <ul>
                {stories}
            </ul>
            <br/>
            <Link to={Routes.story(CREATE)} className="btn btn-primary">
                Add Story
            </Link>
        </div>
    )
}

Stories.propTypes = {
    story: React.PropTypes.object,
    storiesList: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}

export default connect(stateToProps)(Stories)
