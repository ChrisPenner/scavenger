/* @flow */
import React from 'react'
import { connect } from 'react-redux'

import { createClue } from '../actions'
import { getClues } from '../reducers'

const stateToProps = (state) => {
  return {
    clues: getClues(state)
  }
}
class Create extends React.Component {
  state: Object
  storyId: string
  create: () => void
  createClue: (c: Object) => void
  constructor({createClue, params: {storyId}}) {
    super()
    this.state = {
      id: '',
      text: '',
      hint: '',
    }
    this.storyId = storyId
    this.create = this.create.bind(this)
    this.createClue = createClue
  }

  update(changes) {
    this.setState(changes)
  }

  updateId(newId) {
    newId = newId.replace(/[^a-zA-Z0-9-]/g, '').trim().toUpperCase()
    this.setState({
      id: newId
    })
  }

  create() {
    this.createClue({
      uid: `${this.storyId}:${this.state.id}`,
      text: this.state.text,
      hint: this.state.hint,
    })
  }

  render() {
    return (
      <div className="columns">
        <div className="column is-half margin-auto">
          <h1 className="title">New Clue</h1>
          <label
            className="label"
            htmlFor="id">
            Id
          </label>
          <div className="control">
            <input
              id="id"
              className="input"
              type="text"
              onChange={(e) => this.updateId(e.target.value)}
              value={this.state.id} />
          </div>
          <label
            className="label"
            htmlFor="text">
            Text
          </label>
          <div className="control">
            <textarea
              id="text"
              className="textarea"
              onChange={(e) => this.update({
                          text: e.target.value
                        })}
              value={this.state.text} />
          </div>
          <label
            className="label"
            htmlFor="hint">
            Hint
          </label>
          <div className="control">
            <textarea
              id="hint"
              className="textarea"
              onChange={(e) => this.update({
                          hint: e.target.value
                        })}
              value={this.state.hint} />
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
  createClue: React.PropTypes.func.isRequired,
}

export default connect(stateToProps, {
  createClue
})(Create)
