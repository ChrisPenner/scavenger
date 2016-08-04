import { connect } from 'react-redux'
import { createAnswer } from 'actions'
import { getCluesByStory, getAnswers } from 'reducers'

const stateToProps = (state, {location: {query: {storyID, clueID}}}) => {
    return {
        answers: getAnswers(state),
        clues: getCluesByStory(state, storyID),
        storyID,
        clueID,
    }
}
export default connect(stateToProps, {createAnswer})(
class Create extends React.Component {
    constructor({createAnswer, clues}){
        super()
        this.state = {
            answer_id: '',
            pattern: '',
            next_clue: clues[0].uid,
        }
        this.create = this.create.bind(this)
        this.createAnswer = createAnswer
    }

    update(changes){
        this.setState(changes)
    }

    getUID(){
        const {answer_id} = this.state
        const {storyID, clueID} = this.props
        return [storyID, clueID, answer_id].join(':')
    }

    idErrors(){
        if (answer_id === '') {
            return "Please enter an ID";
        } else if (stories[this.getUID()]){
            return `A Answer by this answer_id already exists!`
        } else if (!/^[A-Z0-9-]+$/.test(answer_id)){
            return "answer_id must contain only letters, numbers or '-'"
        }
    }

    updateAnswerID(newAnswerID){
        newAnswerID = newAnswerID.replace(/[^a-zA-Z0-9-]/g, '').trim().toUpperCase()
        this.setState({answer_id: newAnswerID})
    }

    create(){
        this.createAnswer({
            uid: this.getUID(),
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
                        onChange={(e) => this.updateAnswerID(e.target.value)}
                        value={this.state.answer_id}
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
                        value={this.state.next_clue}
                        onChange={(e) => this.update({next_clue: e.target.value})}
                        >
                            {this.props.clues.map(
                                clue => <option key={clue.uid} value={clue.uid}>{clue.clue_id}</option>
                            )}
                        </select>
                </label>
                <br/>
                <button onClick={this.create} className="btn btn-primary"> Create </button>
            </div>
        )
    }
})
