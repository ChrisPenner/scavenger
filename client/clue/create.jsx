import { connect } from 'react-redux'
import { createClue } from 'actions'
import { getClues } from 'reducers'

const stateToProps = (state) => {
    return {
        clues: getClues(state)
    }
}
class Create extends React.Component {
    constructor({createClue, params:{storyId}}){
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

    update(changes){
        this.setState(changes)
    }

    idErrors(){
        const {id} = this.state
        if (id === '') {
            return "Please enter an Id";
        } else if (stories[id]){
            return `A Clue by this id already exists!`
        } else if (!/^[A-Z0-9-]+$/.test(id)){
            return "id must contain only letters, numbers or '-'"
        }
    }

    updateId(newId){
        newId = newId.replace(/[^a-zA-Z0-9-]/g, '').trim().toUpperCase()
        this.setState({id: newId})
    }

    create(){
        this.createClue({
            uid: `${this.storyId}:${this.state.id}`,
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
                        onChange={(e) => this.updateId(e.target.value)}
                        value={this.state.id}
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
}

Create.propTypes = {
    createClue: React.PropTypes.func.isRequired,
}

export default connect(stateToProps, {createClue})(Create)
