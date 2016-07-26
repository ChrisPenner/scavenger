class Clue extends React.Component {
    render() {
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
