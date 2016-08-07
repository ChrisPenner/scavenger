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
        <Link key={story.uid}
            to={Routes.story(story.uid)}
            className="list-group-item">
            <span className="text-info">
                {story.uid}
            </span>
        </Link>
    ))

    return (
        <div>
            <div className="row">
                <div className="col-xs-12">
                    <h2> Stories </h2>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-6">
                    <div className="list-group">
                        {stories}
                    </div>
                    <Link to={Routes.story(CREATE)} className="btn btn-primary">
                        Add Story
                    </Link>
                </div>
            </div>
        </div>
    )
}

Stories.propTypes = {
    story: React.PropTypes.object,
    storiesList: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}

export default connect(stateToProps)(Stories)
