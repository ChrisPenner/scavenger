/* @flow */
import { expect } from 'chai'
import R from 'ramda'

import at from '../action-types'
import reducer from './explorer'
import { changeExplorer } from '../actions'

describe('Explorer Reducer', function() {
  const baseExplorer = {
    text: 'start text',
    toNumber: '1234',
    senderNumber: '555',
    texts: []
  }

  it('should return a default state', function() {
    expect(reducer(undefined, {})).to.not.equal(undefined)
  })

  describe(at.CHANGE_EXPLORER, function() {
    it('should change fields on explorer', function() {
      const action = changeExplorer(['text'], '42')
      const newState = reducer(baseExplorer, action)
      expect(newState).to.eql(R.assoc('text', '42', baseExplorer))
    });
  });
});
