import { connect } from 'react-redux'
import { createStory } from 'actions'
import { getStories } from 'reducers'

const stateToProps = (state) => {
  return getStories(state)
}
class Create extends React.Component {
  constructor({createStory}) {
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

  idErrors() {
    const {uid} = this.state
    if (uid === '') {
      return "Please enter an Id";
    } else if (stories[uid]) {
      return `A Story by this uid already exists!`
    } else if (!/^[A-Z0-9-]+$/.test(uid)) {
      return "uid must contain only letters, numbers or '-'"
    }
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
      defaultHint: this.state.defaultHint
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
Create.propTypes = {
  createStory: React.PropTypes.func.isRequired,
}
export default connect(stateToProps, {
  createStory
})(Create)
