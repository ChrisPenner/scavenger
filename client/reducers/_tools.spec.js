/* @flow */
import { expect } from 'chai'

import reducer, { DEFAULT_STATE } from './tools'

describe('Tools Reducer', function() {

  it('should return a default state', function() {
    expect(reducer(undefined, {})).to.not.equal(undefined)
  })

  describe('default', function() {
    it('should return previous state', function() {
      const action = {type: undefined}
      const newState = reducer(DEFAULT_STATE, action)
      expect(newState).to.equal(DEFAULT_STATE)
    })
  })
})
