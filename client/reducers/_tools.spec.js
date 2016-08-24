/* @flow */
import { expect } from 'chai'
import R from 'ramda'

import at from '../action-types'
import { startDrag, stopDrag, changeTestMessage } from '../actions'
import reducer, { DEFAULT_STATE } from './tools'

describe('Tools Reducer', function() {
  describe('default', function() {
    it('should return previous state', function() {
      const action = {type: undefined}
      const newState = reducer(DEFAULT_STATE, action)
      expect(newState).to.equal(DEFAULT_STATE)
    });
  });

  describe(at.CHANGE_TEST_MESSAGE, function() {
    it('should change testMessage', function() {
      const action = changeTestMessage('new message')
      const newState = reducer(DEFAULT_STATE, action)
      expect(newState).to.eql({testMessage: 'new message'})
    });
  });
});
