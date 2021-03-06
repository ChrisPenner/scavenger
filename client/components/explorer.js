/* @flow */
import React from 'react'
import { connect } from 'react-redux'

import { getExplorer } from '../selectors'
import { changeExplorer, sendMessage } from '../actions'

import type { MessageType } from '../resources'

type TextsProps = {
  texts: Array<MessageType>,
}

const Texts = ({texts}: TextsProps) => {
  const textsView = texts.map(({sender, receiver, text, mediaUrl, source}, i) => {
    return (
      <tr key={i} className={source === 'user' ? 'green': 'blue'}>
        <td>
          {sender}
        </td>
        <td>
          {receiver}
        </td>
        <td>
          {text}
        </td>
        <td>
          {mediaUrl && <div><img src={mediaUrl} /></div> }
        </td>
      </tr>
    )
  })
  return (
    <div>
      <label>
        Results
      </label>
      <table className="table is-bordered">
        <thead>
          <tr>
            <th>
              Sender
            </th>
            <th>
              Receiver
            </th>
            <th>
              Text
            </th>
            <th>
              Media
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

type ExplorerProps = {
  receiver: string,
  sender: string,
  text: string,
  texts: Array<MessageType>,
  changeExplorer: Function,
  sendMessage: Function,
  mediaUrl: string,
}

const stateToProps = getExplorer
const Explorer = ({receiver, sender, text, mediaUrl, changeExplorer, sendMessage, texts}: ExplorerProps) => {
  return (
    <div>
      <h1 className="title">Explorer</h1>
      <div className="columns">
        <div className="column">
          <form action="javascript:void(0);">

            <div className="control">
              <label
                className="label"
                htmlFor="receiver">
                Receiver #
              </label>
              <input
                id="receiver"
                className="input"
                value={receiver}
                placeholder="+555-123-4567"
                onChange={(e) => changeExplorer(['receiver'], e.target.value)} />
            </div>

            <div className="control">
              <label
                className="label"
                htmlFor="from">
                Sender #
              </label>
              <input
                id="from"
                className="input"
                value={sender}
                placeholder="+555-123-4567"
                onChange={(e) => changeExplorer(['sender'], e.target.value)} />
            </div>

            <div className="control">
              <label
                className="label"
                htmlFor="media-url">
                Media Url
              </label>
              <input
                id="media-url"
                className="input"
                value={mediaUrl}
                placeholder="https://placekitten.com/g/300/300"
                onChange={(e) => changeExplorer(['mediaUrl'], e.target.value)} />
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

export default connect(stateToProps, {
  changeExplorer,
  sendMessage
})(Explorer)
