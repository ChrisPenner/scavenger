/* @flow */
import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { Code } from '../resources'
import loadingGuard from '../lib/loaded'

import type { CodeType } from '../resources'
import type { MapOf } from '../reducers'

const stateToProps = (state) => ({
  codes: Code.selectors.getAll(state),
})

const countUsed = R.compose(R.length, R.filter(R.prop('used')))

type CodeProps = {
  codes: MapOf<CodeType>,
}

const CodeComponent = ({codes}: CodeProps) => {
  const codeRows = R.values(codes).map(code => {
    return (
      <tr key={code.uid}>
        <td>{code.storyUid}</td>
        <td>{code.wordString}</td>
        <td>{code.used ? 'USED' : ''}</td>
        <td>{code.singleUse ? 'Single Use' : 'Multi Use'}</td>
      </tr>
    )
  })
  return (
     <section>
      <h1 className="title">Codes</h1>
      <table className="table is-bordered is-striped group__table">
          <thead>
            <tr>
              <th>Story</th>
              <th>Words</th>
              <th>Used ({countUsed(codes)}/{codes.length})</th>
              <th>Single Use</th>
            </tr>
          </thead>
          <tbody>
            {codeRows}
          </tbody>
          </table>
     </section>
  )
}

export default R.compose(
  loadingGuard([Code.type]),
  connect(stateToProps)
)(CodeComponent)
