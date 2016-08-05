import { connect } from 'react-redux'
import { createAnswer } from 'actions'
import { getCluesByStory, getAnswers } from 'reducers'

const stateToProps = (state, {location: {query: {storyUid, clueUid}}}) => {
    return {
        answers: getAnswers(state),
        clues: getCluesByStory(state, storyUid),
        storyUid,
        clueUid,
    }
}
export default connect(stateToProps, {createAnswer})(
class Create extends React.Component {
    constructor({createAnswer, clues}){
        super()
        this.state = {
            answerId: '',
            pattern: '',
            nextClue: clues[0].uid,
        }
        this.create = this.create.bind(this)
        this.createAnswer = createAnswer
    }

    update(changes){
        this.setState(changes)
    }

    getUId(){
        const {answerId} = this.state
        const {clueUid} = this.props
        return [clueUid, answerId].join(':')
    }

    idErrors(){
        if (answerId === '') {
            return "Please enter an Id";
        } else if (stories[this.getUId()]){
            return `A Answer by this answerId already exists!`
        } else if (!/^[A-Z0-9-]+$/.test(answerId)){
            return "answerId must contain only letters, numbers or '-'"
        }
    }

    updateAnswerId(newAnswerId){
        newAnswerId = newAnswerId.replace(/[^a-zA-Z0-9-]/g, '').trim().toUpperCase()
        this.setState({answerId: newAnswerId})
    }

    create(){
        this.createAnswer({
            uid: this.getUId(),
            pattern: this.state.pattern,
            nextClue: this.state.nextClue,
        })
    }

    render(){
        return (
            <div>
                <h1> New Answer </h1>
                <label> Id:
                    <input
                        type="text"
                        onChange={(e) => this.updateAnswerId(e.target.value)}
                        value={this.state.answerId}
                    />
                </label>
                <br/>
                <label> Pattern:
                    <br/>
                    <input
                        onChange={(e) => this.update({pattern: e.target.value})}
                        value={this.state.pattern}
                        />
                </label>
                <br/>
                <label> Next Clue:
                    <br/>
                    <select
                        className="form-control"
                        value={this.state.nextClue}
                        onChange={(e) => this.update({nextClue: e.target.value})}
                        >
                            {this.props.clues.map(
                                clue => <option key={clue.uid} value={clue.uid}>{clue.uid}</option>
                            )}
                        </select>
                </label>
                <br/>
                <button onClick={this.create} className="btn btn-primary"> Create </button>
            </div>
        )
    }
})
