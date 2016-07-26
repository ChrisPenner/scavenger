export default class Answer extends React.Component{
    constructor(props){
        super(props)
        this.state = {...props.answer}
    }

    render(){
        const { answer } = this.state
        return (
            <div className="input-group">
                <label>Pattern
                    <input
                        className="form-control"
                        type="text"
                        value={this.state.pattern}
                        onChange={(e)=> this.setState({pattern: e.target.value})}
                    />
                </label>
                <label>Next Clue
                    <select
                        className="form-control"
                        value={this.state.next_clue}
                        onChange={(e)=> this.setState({next_clue: e.target.value})}
                        >
                            {this.props.clueIDs.map(clueID=><option key={clueID} value={clueID}>{clueID}</option>)}
                        </select>
                </label>
            </div>
        )
    }
}
