import { connect } from 'react-redux'
import { createClue } from 'actions'
import { getClues } from 'reducers'

const stateToProps = (state) => {
    return {
        clues: getClues(state)
    }
}
export default connect(stateToProps, {createClue})(
class Create extends React.Component {
    constructor({createClue, location: {query: {storyId}}}){
        super()
        this.state = {
            uid: '',
            text: '',
            hint: '',
        }
        this.storyId = storyId
        this.create = this.create.bind(this)
        this.createClue = createClue
    }

    update(changes){
        this.setState(changes)
    }

    idErrors(){
        const {uid} = this.state
        if (uid === '') {
            return "Please enter an Id";
        } else if (stories[uid]){
            return `A Clue by this uid already exists!`
        } else if (!/^[A-Z0-9-]+$/.test(uid)){
            return "uid must contain only letters, numbers or '-'"
        }
    }

    updateUid(newUid){
        newUid = newUid.replace(/[^a-zA-Z0-9-]/g, '').trim().toUpperCase()
        this.setState({uid: newUid})
    }

    create(){
        this.createClue({
            uid: `${this.storyId}:${this.state.uid}`,
            text: this.state.text,
            hint: this.state.hint,
        })
    }

    render(){
        return (
            <div>
                <h1> New Clue </h1>
                <label> Id:
                    <input
                        type="text"
                        onChange={(e) => this.updateUid(e.target.value)}
                        value={this.state.uid}
                    />
                </label>
                <br/>
                <label> Text:
                    <br/>
                    <textarea
                        onChange={(e) => this.update({text: e.target.value})}
                        value={this.state.text}
                        />
                </label>
                <br/>
                <label> Hint:
                    <br/>
                    <textarea
                        onChange={(e) => this.update({hint: e.target.value})}
                        value={this.state.hint}
                        />
                </label>
                <br/>
                <button onClick={this.create} className="btn btn-primary"> Create </button>
            </div>
        )
    }
})
