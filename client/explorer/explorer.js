import {connect} from 'react-redux'
import {getExplorer} from 'reducers'
import {changeExplorer, sendMessage} from 'actions'

const Texts = ({texts}) => {
    const textsView = texts.map(({from, to, body}, i)=> {
        return (
            <tr key={i}>
                <td>
                    {from}
                </td>
                <td>
                    {to}
                </td>
                <td>
                    {body}
                </td>
            </tr>
        )
    })
    return (
        <table className="table table-hover table-bordered table-striped">
            <thead>
                <tr>
                    <th> From </th>
                    <th> To </th>
                    <th> Text </th>
                </tr>
            </thead>
            <tbody>
                {textsView}
            </tbody>
        </table>
    )
}
Text.propTypes = {
    texts: React.PropTypes.arrayOf(React.PropTypes.object),
}

const stateToProps = (state) => {
    return getExplorer(state)
}
const Explorer = ({toNumber, fromNumber, text, changeExplorer, sendMessage, texts}) =>{
    return (
        <div>
            <div className="row">
                <div className="col-xs-12">
                    <h1> Explorer </h1>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-3">
                    <form action="javascript:void(0);">
                        <div className="form-group">
                            <label htmlFor="to"> To # </label>
                            <input
                                id="to"
                                className="form-control"
                                value={toNumber}
                                placeholder="+555-123-4567"
                                onChange={(e) => changeExplorer(['toNumber'], e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="from"> From # </label>
                            <input
                                id="from"
                                className="form-control"
                                value={fromNumber}
                                placeholder="+555-123-4567"
                                onChange={(e) => changeExplorer(['fromNumber'], e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="text"> Text </label>
                            <div className="input-group">
                                <input
                                    id="text"
                                    className="form-control"
                                    value={text}
                                    placeholder="Hi mom!"
                                    onChange={(e) => changeExplorer(['text'], e.target.value)}
                                />
                                <span className="input-group-btn">
                                    <button
                                        onClick={()=> sendMessage()}
                                        className="btn btn-primary">
                                        Send
                                    </button>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-9">
                    <Texts texts={texts}/>
                </div>
            </div>
        </div>
    )
}
Explorer.propTypes = {
    toNumber: React.PropTypes.string.isRequired,
    fromNumber: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    texts: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    changeExplorer: React.PropTypes.func.isRequired,
    sendMessage: React.PropTypes.func.isRequired,
}
export default connect(stateToProps, {changeExplorer, sendMessage})(Explorer)
