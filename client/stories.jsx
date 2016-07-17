import React from 'react'
import { Link } from 'react-router'
import Routes from './routes'
class Stories extends React.Component {
    constructor(props, context){
        super(props, context)
        this.state = {
            stories: [],
        }
    }

    componentWillMount() {
        fetch(`/stories.json`)
        .then(resp => resp.json())
        .then(stories => this.setStories(stories))
        .catch(err => console.error(`Failed to get Stories: ${err}`))
    }

    setStories(stories) {
        this.setState({ stories })
    }

    getStory(storyID) {
        for (const story of this.state.stories) {
            if (story.name === storyID) {
                return story
            }
        }
    }

    render() {
        const { children:Story, params: {storyID} } = this.props
        if (Story) {
            return React.cloneElement(Story, {story: this.getStory(storyID)})
        }
        const stories = this.state.stories.map(story => (
            <div key={story.name}>
                <Link to={Routes.story(story.name)}> {story.name} </Link>
            </div>
        ))
        return (
            <div> My Stories:
                {stories}
            </div>
        )
    }
}

const Story = ({ story }) => {
    if (!story) {
        return <div>Loading...</div>
    }
    return (
        <h1> {story.name} </h1>
    )}

export {Story, Stories}
