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
    const clueHTML = Object.keys(story.clues).map(clueID => {
        const answers = (story.clues[clueID].answers || []).map((answer, i) => {
            const [pattern, nextClueID] = answer;
            return (
                <div key={i}>
                    <div>Pattern: {pattern} </div>
                    <div>Next Clue ID: {nextClueID} </div>
                </div>
            )
        })
        return (
            <div key={clueID}>
                <div> ID: {clueID} </div>
                <div> {answers} </div>
            </div>
        )
    })

    return (
        <div>
            <h1> {story.name} </h1>
            <div> {clueHTML} </div>
        </div>
    )}

export {Story, Stories}
