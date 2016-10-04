/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import * as Routes from '../routes'
import { createAnswer } from '../actions'
import type { FSA } from '../actions'

import { getCluesByStory, getAnswers } from '../reducers'
import { Answer } from '../resources'
import { uidsFromParams } from '../utils'

const stateToProps = (state, {params}) => {
  const {storyUid, clueUid} = uidsFromParams(params)
  return {
    answers: getAnswers(state),
    clues: getCluesByStory(state, storyUid),
    stories: getCluesByStory(state, storyUid),
    storyUid,
    clueUid,
  }
}
class Create extends React.Component {
  create: () => void
  createAnswer: (a: Object) => Promise<FSA>
  state: Object
  clueUid: string
  push: (path: string) => FSA
  constructor({createAnswer, clues, clueUid, push}) {
    super()
    this.state = {
      answerUid: '',
      pattern: '',
      nextClue: clues[0].uid,
    }
    this.create = this.create.bind(this)
    this.createAnswer = createAnswer
    this.clueUid = clueUid
    this.push = push
  }

  update(changes) {
    this.setState(changes)
  }

  getUid() {
    const {answerUid} = this.state
    return [this.clueUid, answerUid].join(':')
  }

  updateAnswerId(newAnswerId) {
    newAnswerId = newAnswerId.replace(/[^a-zA-Z0-9-]/g, '').trim().toUpperCase()
    this.setState({
      answerUid: newAnswerId
    })
  }

  create() {
    const uid = this.getUid()
    return this.createAnswer({
      uid,
      pattern: this.state.pattern,
      nextClue: this.state.nextClue,
    }).then(() => this.push(Answer.route(uid)))
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
              value={this.state.answerUid} />
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
