import { connect } from 'react-redux'
import { createAnswer } from 'actions'
import { getClues } from 'reducers'

const stateToProps = (state) => {
    return {
        answers: state.answers,
        clueIDs: Object.keys(getClues(state, answer.clue_id)),
    }
}
export default connect(stateToProps, {createAnswer})(
class Create extends React.Component {
    constructor({createAnswer}){
        super()
        this.state = {
            uid: '',
            pattern: '',
            next_clue: '',
        }
        this.create = this.create.bind(this)
        this.createAnswer = createAnswer
    }

    update(changes){
        this.setState(changes)
    }

    idErrors(){
        const {uid} = this.state
        if (uid === '') {
            return "Please enter an ID";
        } else if (stories[uid]){
            return `A Answer by this uid already exists!`
        } else if (!/^[A-Z0-9-]+$/.test(uid)){
            return "uid must contain only letters, numbers or '-'"
        }
    }

    updateUID(newUID){
        newUID = newUID.replace(/[^a-zA-Z0-9-]/g, '').trim().toUpperCase()
        this.setState({uid: newUID})
    }

    create(){
        this.createAnswer({
            uid: this.state.uid,
            pattern: this.state.pattern,
            next_clue: this.state.next_clue,
        })
    }

    render(){
        return (
            <div>
                <h1> New Answer </h1>
                <label> ID:
                    <input
                        type="text"
                        onChange={(e) => this.updateUID(e.target.value)}
                        value={this.state.uid}
                    />
                </label>
                <br/>
                <label> Pattern:
                    <br/>
                    <input
                        onChange={(e) => this.update({text: e.target.value})}
                        value={this.state.text}
                        />
                </label>
                <br/>
                <label> Next Clue:
                    <br/>
                    <textarea
                        onChange={(e) => this.update({next_clue: e.target.value})}
                        value={this.state.next_clue}
                        />
                        <select
                            className="form-control"
                            value={this.state.next_clue}
                            onChange={(e) => this.update({next_clue: e.target.value})}
                            >
                                {clueIDs.map(clueID=><option key={clueID} value={clueID}>{clueID}</option>)}
                                </select>
                </label>
                <br/>
                <button onClick={this.create} className="btn btn-primary"> Create </button>
            </div>
        )
    }
})
