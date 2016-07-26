import * as Res from './resources'
export class Clue extends React.Component {
    componentWillMount() {
        this.setState({loading: true})
        const clueUID = this.props.params.clueUID
        const cluePromise = Res.Clue.get(clueUID)
            .then(clue => this.setState({clue}))

        const answersPromise = Res.Answer.byClue(clueUID)
            .then(answers => this.setState({answers}))

        Promise.all([cluePromise, answersPromise])
            .then(() => this.setState({loading: false}))
            .then(()=>console.log(this.state))
    }

    render() {
        if (this.state.loading){
            return <div> Loading... </div>
        }
        const answers = clue.answers.map(answerID=>this.props.answers[answerID])
        const answerView = answers.map(answer => (
                    <Answer key={answer.uuid} answer={answer} />
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
                <button onClick={()=>addAnswer(clue.clue_id)}>+</button>
            </div>
        </div>
        )
    }
}
