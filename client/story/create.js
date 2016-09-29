/* @flow */
import React from 'react'
import { connect } from 'react-redux'
import { createStory } from '../actions'
import { getStories } from '../reducers'

const stateToProps = (state) => {
  return getStories(state)
}
class Create extends React.Component {
  state: Object
  create: () => void
  createStory: (s: Object) => void
  constructor({createStory}) {
    super()
    this.state = {
      uid: '',
      defaultHint: '',
      defaultEnd: '',
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
      defaultEnd: this.state.defaultEnd
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
          <label
            className="label"
            htmlFor="end">
            Default End
          </label>
          <div className="control">
            <textarea
              id="end"
              className="textarea"
              onChange={(e) => this.update({
                          defaultEnd: e.target.value
                        })}
              value={this.state.defaultEnd} />
          </div>

          <p className="control">
            <label
              htmlFor="allows-groups">
              <input
                id="allows-groups"
                type="checkbox"
                checked={story.allowsGroups || false}
                onChange={(e) => changeStory([story.uid, 'allowsGroups'], e.target.checked)} />
              Send group join code at start
            </label>
          </p>

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
  createStory: React.PropTypes.func.isRequired,
}
export default connect(stateToProps, {
  createStory
})(Create)
