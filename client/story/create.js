/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { createStory } from '../actions'
import { getStories } from '../reducers'

const stateToProps = (state) => {
  return getStories(state)
}

type CreateStoryProps = {
  createStory: Function,
}

class Create extends React.Component {
  state: Object
  create: () => void
  createStory: (s: Object) => void
  constructor({createStory}: CreateStoryProps) {
    super()
    this.state = {
      uid: '',
      defaultHint: '',
    }
    this.create = this.create.bind(this)
    this.createStory = createStory
  }

  update(changes) {
    this.setState(changes)
  }

  updateUid(newUid) {
    newUid = newUid.replace(/[^a-zA-Z0-9-]/g, '').trim().toUpperCase()
    this.setState({
      uid: newUid
    })
  }

  create() {
    this.createStory({
      uid: this.state.uid,
      defaultHint: this.state.defaultHint,
    })
  }

  render() {
    return (
      <div className="columns">
        <div className="column is-half margin-auto">
          <h1 className="title">New Story</h1>
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
              onChange={(e) => this.updateUid(e.target.value)}
              value={this.state.uid} />
          </div>
          <label
            className="label"
            htmlFor="hint">
            Default Hint
          </label>
          <div className="control">
            <textarea
              id="hint"
              className="textarea"
              onChange={(e) => this.update({
                          defaultHint: e.target.value
                        })}
              value={this.state.defaultHint} />
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
  createStory
})(Create)
