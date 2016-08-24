/* @flow */
import { expect } from 'chai'
import R from 'ramda'

import * as at from '../action-types'
import reducer from './explorer'
import { changeExplorer } from '../actions'

describe('Explorer Reducer', function() {
  const baseExplorer = {
    text: 'start text',
    toNumber: '1234',
    senderNumber: '555',
    texts: []
  }
  describe(changeExplorer.toString(), function() {
    it('should change fields on explorer', function() {
      const action = changeExplorer(['text'], '42')
      const newState = reducer(baseExplorer, action)
      expect(newState).to.eql(R.assoc('text', '42', baseExplorer))
    });
  });
});
