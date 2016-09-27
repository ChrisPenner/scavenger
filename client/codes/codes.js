/* @flow */
import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Routes from '../routes'
import { getCodesList } from '../reducers'

const stateToProps = (state) => ({
  codes: getCodesList(state),
})

const countUsed = R.compose(R.length, R.filter(R.prop('used')))

const Code = ({codes}) => {
  const codeRows = codes.map(code => {
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

Code.propTypes = {
  code: React.PropTypes.object,
  codes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
}

export default connect(stateToProps)(Code)