import * as Res from './resources'
import Answer from './answer'
export class Clue extends React.Component {
    componentWillMount() {
        this.setState({loading: true})
        const { clueUID } = this.props.params
        const storyUID = clueUID.split(':')[0]
        const cluesPromise = Res.Clue.index(storyUID)
            .then(clues => this.setState({clues, clue: clues[clueUID]}))

        const answersPromise = Res.Answer.byClue(clueUID)
            .then(answers => this.setState({answers}))

        Promise.all([cluesPromise, answersPromise])
            .then(() => this.setState({loading: false}))
    }

    render() {
        if (this.state.loading){
            return <div> Loading... </div>
        }
        const { clue } = this.state
        const answers = clue.answers.map(answerID=>this.state.answers[answerID])
        const answerView = answers.map(answer => (
                    <Answer key={answer.uid} answer={answer} clueIDs={Object.keys(this.state.clues)}/>
                    ))
        return (
            <div key={clue.clue_id} className="panel panel-info">
                <div className="panel-heading">
                    {clue.clue_id}
                </div>
                <div className="panel-body">
                <label>
                    Text:
                    <input
                        onChange={(e)=>this.props.changeState('clues', clue.clue_id, {text: e.target.value})}
                        value={clue.text || ''}
                    />
                </label>
                <br/>
                <label>
                    Hint:
                    <input
                        onChange={(e)=>this.props.changeState('clues', clue.clue_id, {hint: e.target.value})}
                        value={clue.hint || ''}
                    />
                </label>
                <h4>Answers </h4>
                {answerView}
            </div>
        </div>
        )
    }
}
