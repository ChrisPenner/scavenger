import { connect } from 'react-redux'
import { createStory } from 'actions'
import {getStories} from 'reducers'

const stateToProps = (state) => {
    return getStories(state)
}
export default connect(stateToProps, {createStory})(
class Create extends React.Component {
    constructor({createStory}){
        super()
        this.state = {
            uid: '',
            defaultHint: '',
        }
        this.create = this.create.bind(this)
        this.createStory = createStory
    }

    update(changes){
        this.setState(changes)
    }

    idErrors(){
        const {uid} = this.state
        if (uid === '') {
            return "Please enter an ID";
        } else if (stories[uid]){
            return `A Story by this uid already exists!`
        } else if (!/^[A-Z0-9-]+$/.test(uid)){
            return "uid must contain only letters, numbers or '-'"
        }
    }

    updateUID(newUID){
        newUID = newUID.replace(/[^a-zA-Z0-9-]/g, '').trim().toUpperCase()
        this.setState({uid: newUID})
    }

    create(){
        this.createStory({
            uid: this.state.uid,
            default_hint: this.state.defaultHint
        })
    }

    render(){
        return (
            <div>
                <h1> New Story </h1>
                <label> ID:
                    <input
                        type="text"
                        onChange={(e) => this.updateUID(e.target.value)}
                        value={this.state.uid}
                    />
                </label>
                <br/>
                <label> Default Hint:
                    <br/>
                    <textarea
                        onChange={(e) => this.update({defaultHint: e.target.value})}
                        value={this.state.defaultHint}
                        />
                </label>
                <br/>
                <button onClick={this.create} className="btn btn-primary"> Create </button>
            </div>
        )
    }
})
