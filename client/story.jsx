import { Link } from 'react-router'
import Routes from './routes'
import * as Res from './resources'
import uuid from 'uuid4'

import merge from 'lodash/merge'

class Stories extends React.Component {
    constructor(){
        super()
        this.state = {
            stories: {},
            loading: false,
        }
        this.addAnswer = this.addAnswer.bind(this)
    }

    componentWillMount() {
        this.setState({loading: true})
        const storiesPromise = Res.Story.index()
            .then(stories => this.setState({stories}))
            .then(() => this.setState({loading: false}))
    }

    getStories(){
        return Object.keys(this.state.stories)
    }

    getStory(storyUID){
        return this.state.stories[storyUID]
    }

    addAnswer(){

    }

    render() {
        if (this.state.loading){
            return <div> Loading... </div>
        }

        const { storyUID } = this.props.params
        let child;
        if (storyUID){
            return (
                    <Story
                    {...this.state}
                    story={this.getStory(storyUID)}
                    addAnswer={this.addAnswer}
                    />
                    )
        }

        const stories = this.getStories().map(storyUID=>(
            <div key={storyUID}>
                <Link to={`/stories/${storyUID}`}> {storyUID} </Link>
            </div>
        ))

        return (
            <div> My Stories:
                {stories}
            </div>
        )
    }
}

class Answer extends React.Component {
    render() {
        const { answer, changeState, clues } = this.props
        return (
                <div className="container input-group">
                <label>
                    Pattern:
                    <input
                        className="form-control"
                        onChange={(e)=>changeState('answers', answer.uuid, {pattern: e.target.value})}
                        value={answer.pattern || ''}
                        />
                    </label>
                    <label>
                    Next Clue:
                    <select
                        className="form-control"
                        onChange={(e)=>changeState('answers', answer.uuid, {next: e.target.value})}
                        value={answer.next}
                        >
                            {clues.map(clueID=><option key={clueID} value={clueID}>{clueID}</option>)}
                        </select>
                    </label>
                </div>
        )
    }
}

class Story extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            clues: {},
            loading: false,
        }
        this.storyUID = this.props.params.storyUID
    }

    componentWillMount() {
        this.setState({loading: true})
        const cluesPromise = Res.Clue.index(this.props.params.storyUID)
            .then(clues => this.setState({clues}))

        const storyPromise = Res.Story.get(this.props.params.storyUID)
            .then(story => this.setState({story}))

        Promise.all([cluesPromise, storyPromise])
            .then(() => this.setState({loading: false}))
    }

    getClues() {
        return Object.keys(this.state.clues).map(clueID => this.props.clues[clueID])
    }

    render(){
        if (this.state.loading){
            return <div> Loading... </div>
        }

        const story = this.state.story
            console.log(this.state)
        const clues = this.getClues().map(clue=>(
                        <div key={clue.uid}>
                            <Link to={Routes.clue(clue.uid)}> {clue.clue_id} </Link>
                        </div>
                    ))
        return (
            <div>
                <h1>{story.name}</h1>
                <label>
                    Default Hint:
                    <input onChange={(e)=>this.props.changeState('stories', story.name, {default_hint: e.target.value})} value={story.default_hint || ''} />
                </label>
                <div>
                    {clues}
                </div>
            </div>
        )
    }
}

export {Story, Stories}
