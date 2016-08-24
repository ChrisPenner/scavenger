/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import * as Routes from '../routes'
import { createAnswer } from '../actions'
import type { FSA } from '../actions'

import { getCluesByStory, getAnswers } from '../reducers'

const stateToProps = (state, {params: {storyId, clueId}}) => {
  return {
    answers: getAnswers(state),
    clues: getCluesByStory(state, storyId),
    stories: getCluesByStory(state, storyId),
    storyId,
    clueId,
  }
}
class Create extends React.Component {
  create: () => void
  createAnswer: (a: Object) => Promise<FSA>
  state: Object
  storyId: string
  clueId: string
  push: (path: string) => FSA
  constructor({createAnswer, clues, storyId, clueId, push}) {
    super()
    this.state = {
      answerId: '',
      pattern: '',
      nextClue: clues[0].uid,
    }
    this.create = this.create.bind(this)
    this.createAnswer = createAnswer
    this.storyId = storyId
    this.clueId = clueId
    this.push = push
  }

  update(changes) {
    this.setState(changes)
  }

  getUid() {
    const {answerId} = this.state
    return [this.storyId, this.clueId, answerId].join(':')
  }

  updateAnswerId(newAnswerId) {
    newAnswerId = newAnswerId.replace(/[^a-zA-Z0-9-]/g, '').trim().toUpperCase()
    this.setState({
      answerId: newAnswerId
    })
  }

  create() {
    const uid = this.getUid()
    return this.createAnswer({
      uid,
      pattern: this.state.pattern,
      nextClue: this.state.nextClue,
    }).then(() => this.push(Routes.answer(uid)))
  }

  render() {
    return (
      <div className="columns">
        <div className="column is-half margin-auto">
          <h1 className="title">New Answer</h1>
          <label
            htmlFor="id"
            className="label">
            Id
          </label>
          <div className="control">
            <input
              id="id"
              className="input"
              type="text"
              onChange={(e) => this.updateAnswerId(e.target.value)}
              value={this.state.answerId} />
          </div>
          <label
            className="label"
            htmlFor="pattern">
            Pattern
          </label>
          <div className="control">
            <input
              id="pattern"
              className="input"
              onChange={(e) => this.update({
                          pattern: e.target.value
                        })}
              value={this.state.pattern} />
          </div>
          <label
            className="label"
            htmlFor="next-clue">
            Next Clue
          </label>
          <div className="control">
            <span className="select"><select
                                       id="next-clue"
                                       value={this.state.nextClue}
                                       onChange={(e) => this.update({
                                                   nextClue: e.target.value
                                                 })} > {this.props.clues.map(
                                                                                                                                                                                                            clue => <option
                                                                                                                                                                                                                      key={clue.uid}
                                                                                                                                                                                                                      value={clue.uid}>
                                                                                                                                                                                                                      {clue.uid}
                                                                                                                                                                                                                    </option>
                                                                                                                                                                                                          )} </select></span>
          </div>
          <button
            onClick={this.create}
            className="button is-success">
            Create
          </button>
        </div>
      </div>
    )
  }
}
Create.propTypes = {
  createAnswer: React.PropTypes.func.isRequired,
  clues: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}
export default connect(stateToProps, {
  createAnswer,
  push,
})(Create)
