/* @flow */
import { expect } from 'chai'

import at from '../action-types'
import { startDrag, stopDrag } from '../actions'
import reducer from './ui'

const defaultUi = {
  dragData: null
}

describe('UI Reducer', function() {

  it('should return a default state', function() {
    expect(reducer(undefined, {})).to.not.equal(undefined)
  })

  describe('default', function() {
    it('should return previous state', function() {
      const action = {type: undefined}
      const origState = {}
      const newState = reducer(origState, action)
      expect(newState).to.equal(origState)
    })
  })

  describe(at.START_DRAG, function() {
    it('should set dragData', function() {
      const action = startDrag('mypayload')
      const newState = reducer(defaultUi, action)
      expect(newState).to.eql({dragData: 'mypayload'})
    })
  })

  describe(at.STOP_DRAG, function() {
    it('should unset dragData', function() {
      const action = stopDrag()
      const newState = reducer({ dragData: 'something' }, action)
      expect(newState).to.eql({dragData: null})
    })
  })
})
