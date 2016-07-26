import React from 'react'
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
            clues: {},
            loading: false,
        }
        this.addAnswer = this.addAnswer.bind(this)
    }

    componentWillMount() {
        this.setState({loading: true})
        const storiesPromise = Res.Story.index()
            .then(resp => resp.json())
            .then(stories => this.setState({stories}))

        const cluesPromise = Res.Clue.index()
            .then(resp => resp.json())
            .then(clues => this.setState({clues}))

        Promise.all([storiesPromise, cluesPromise])
            .then(() => this.setState({loading: false}))
    }

    getStories(){
        return Object.keys(this.state.stories)
    }

    getClues(){
        return Object.keys(this.state.clues)
    }

    getStory(storyID){
        return this.state.stories[storyID]
    }

    getClue(clueID){
        return this.state.clues[clueID]
    }

    addAnswer(){

    }

    render() {
        if (this.state.loading){
            return <div> Loading... </div>
        }
        const { storyID } = this.props.params
        let child;
        if (storyID && this.state.stories[storyID]){
            child = <Story
                {...this.state}
                story={this.getStory(storyID)}
                addAnswer={this.addAnswer}
                />
        } else {
            child = <Index stories={this.getStories()} />
        }

        return (
            <div>
                {child}
            </div>
        )
    }
}

class Index extends React.Component {
    render() {
        const stories = this.props.stories.map(storyID=>(
            <div key={storyID}>
                <Link to={`/stories/${storyID}`}> {storyID} </Link>
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
    getClues(storyID) {
        return Object.keys(this.props.clues).map(clueID => this.props.clues[clueID])
    }
    render(){
        const {story, addAnswer } = this.props
        const clues = this.getClues(story.uid).map(clue=>(
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
