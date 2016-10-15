/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { createAnswer } from '../actions'
import type { FSA } from '../actions'

import { getClueUidsByStory } from '../reducers'
import { Answer } from '../resources'
import { uidsFromParams } from '../utils'

const stateToProps = (state, {params}) => {
  const {storyUid, clueUid} = uidsFromParams(params)
  return {
    answers: Answer.selectors.getAll(state),
    clueUids: storyUid && getClueUidsByStory(state, storyUid),
    storyUid,
    clueUid,
  }
}

type CreateAnswerProps = {
  createAnswer: Function,
  push: Function,
  clueUids: Array<string>,
  clueUid: string,
  clueUids: string,
}

class Create extends React.Component {
  create: () => void
  createAnswer: (a: Object) => Promise<FSA>
  state: Object
  clueUid: string
  push: (path: string) => FSA
  constructor({createAnswer, clueUids, clueUid, push}: CreateAnswerProps) {
    super()
    this.state = {
      answerUid: '',
      pattern: '',
      nextClue: clueUids[0],
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
                })} > {this.props.clueUids.map(
                  option => <option
                    key={option}
                    value={option}>
                    {option}
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

export default connect(stateToProps, {
  createAnswer,
  push,
})(Create)
