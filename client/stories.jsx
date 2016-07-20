import React from 'react'
import { Link } from 'react-router'
import Routes from './routes'
import * as Res from './resources'
import uuid from 'uuid4'

import merge from 'lodash/merge'

import { normalize, Schema, arrayOf } from 'normalizr';
const storySchema = new Schema('stories', { idAttribute: 'name' });
const clueSchema = new Schema('clues', { idAttribute: 'clue_id' });
const answerSchema = new Schema('answers', { idAttribute: 'uuid' });

storySchema.define({
  clues: arrayOf(clueSchema),
});

clueSchema.define({
    answers: arrayOf(answerSchema),
})


class Stories extends React.Component {
    constructor(){
        super()
        this.state = {
            entities: {
                stories: {},
                clues: {},
                answers: {},

            },
            result: [],
        }
        this.changeState = this.changeState.bind(this)
        this.addAnswer = this.addAnswer.bind(this)
    }

    componentWillMount() {
        Res.Story.index()
        .then(resp => resp.json())
        .then(json => normalize(json, arrayOf(storySchema)))
        .then(story => {this.setState(story); console.log(this.state)})
    }

    getStories(){
        return this.state.result.map(storyID=>this.state.entities.stories[storyID])
    }

    changeState(entityType, ID, changes){
        const changedState = { entities: { [entityType]: { [ID]: { ...changes }}}}
        const newState = merge({}, this.state, changedState)
        this.setState(newState)
    }

    addAnswer(clueID){
        const answer = {
            uuid: uuid(),
        }
        const changedState = { entities: { 
            answers: { [answer.uuid]: answer},
            clues: { [clueID]: {answers: [...this.state.entities.clues[clueID].answers, answer.uuid]}}
        }}
        const newState = merge({}, this.state, changedState)
        this.setState(newState)
    }

    render() {
        const { storyID } = this.props.params
        let child;
        if (storyID && this.state.entities.stories[storyID]){
            child = <Story 
                {...this.state.entities} 
                story={this.state.entities.stories[storyID]}
                changeState={this.changeState}
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
        const stories = this.props.stories.map(story=>(
            <div key={story.name}>
                <Link to={`/stories/${story.name}`}> {story.name} </Link>
            </div>
        ))
        return (
            <div> My Stories:
                {stories}
            </div>
        )
    }
}

class Clue extends React.Component {
    render() {
        return (
            <div>
                Clue
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
    render(){
        const {story, addAnswer } = this.props
        const clues = story.clues.map(clueID=>this.props.clues[clueID])
        const clueView = clues.map(clue=>{
            const answers = clue.answers.map(answerID=>this.props.answers[answerID])
            const answerView = answers.map(answer=> <Answer  key={answer.uuid} answer={answer} clues={story.clues} changeState={this.props.changeState}/>)
            return (
            <div key={clue.clue_id} className="panel panel-info">
                    <div className="panel-heading">
                        {clue.clue_id}
                    </div>
                    <div className="panel-body">
                <label>
                    Text:
                    <input
                        onChange={(e)=>this.props.changeState('clues', clue.clue_id, {text: e.target.value})}
                        value={clue.text || ''}
                    />
                </label>
                <br/>
                <label>
                    Hint:
                    <input
                        onChange={(e)=>this.props.changeState('clues', clue.clue_id, {hint: e.target.value})}
                        value={clue.hint || ''}
                    />
                </label>
                <h4>Answers </h4>
                {answerView}
                <button onClick={()=>addAnswer(clue.clue_id)}>+</button>
            </div>
        </div>
        )})

        return (
            <div>
                <h1>{story.name}</h1>
                <label>
                    Default Hint:
                    <input onChange={(e)=>this.props.changeState('stories', story.name, {default_hint: e.target.value})} value={story.default_hint || ''} />
                </label>
                <div>
                    {clueView}
                </div>
            </div>
        )
    }
}

export {Story, Stories}
