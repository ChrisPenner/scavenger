/* @flow */
import React from 'react'
import { connect } from 'react-redux'

import { getExplorer } from '../reducers'
import { changeExplorer, sendMessage } from '../actions'

const Texts = ({texts}) => {
  const textsView = texts.map(({from, to, body} , i) => {
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
    <div>
      <label>
        Results
      </label>
      <table className="table is-striped is-bordered">
        <thead>
          <tr>
            <th>
              From
            </th>
            <th>
              To
            </th>
            <th>
              Text
            </th>
          </tr>
        </thead>
        <tbody>
          {textsView}
        </tbody>
      </table>
    </div>
  )
}
Texts.propTypes = {
  texts: React.PropTypes.arrayOf(React.PropTypes.object),
}

const stateToProps = (state) => {
  return getExplorer(state)
}
const Explorer = ({toNumber, fromNumber, text, changeExplorer, sendMessage, texts}) => {
  return (
    <div>
      <h1 className="title">Explorer</h1>
      <div className="columns">
        <div className="column">
          <form action="javascript:void(0);">
            <div className="control">
              <label
                className="label"
                htmlFor="to">
                To #
              </label>
              <input
                id="to"
                className="input"
                value={toNumber}
                placeholder="+555-123-4567"
                onChange={(e) => changeExplorer(['toNumber'], e.target.value)} />
            </div>
            <div className="control">
              <label
                className="label"
                htmlFor="from">
                From #
              </label>
              <input
                id="from"
                className="input"
                value={fromNumber}
                placeholder="+555-123-4567"
                onChange={(e) => changeExplorer(['fromNumber'], e.target.value)} />
            </div>
            <label
              className="label"
              htmlFor="text">
              Text
            </label>
            <div className="control has-addons">
              <input
                id="text"
                className="input is-expanded"
                value={text}
                placeholder="Hi mom!"
                onChange={(e) => changeExplorer(['text'], e.target.value)} />
              <button
                onClick={() => sendMessage()}
                className="button is-primary">
                Send
              </button>
            </div>
          </form>
        </div>
        <div className="column is-8">
          <Texts texts={texts} />
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
export default connect(stateToProps, {
  changeExplorer,
  sendMessage
})(Explorer)
