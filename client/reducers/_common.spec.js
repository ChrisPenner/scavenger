/* @flow */
import { expect } from 'chai'

import at from '../actions/types'
import { changeClue } from '../actions'
import reducerWrapper from './common'
import { Clue } from '../resources'

const fakeClueReducer = (state={ default: true }) => state
const reducer = reducerWrapper(Clue.type, fakeClueReducer)
describe('Common Reducer', function() {

  it("should return its reducer's default state", function() {
    expect(reducer(undefined, {})).to.eql({default: true})
  })

  describe('default', function() {
    it('should return previous state', function() {
      const action = {type: undefined}
      const origState = {}
      const newState = reducer(origState, action)
      expect(newState).to.equal(origState)
    })
  })

  describe('SAVE_*', function() {
    it('should replace state with payload', function() {
      const action = { type: at.save(Clue.type), payload: {uid: 42 }}
      const newState = reducer({}, action)
      expect(newState).to.eql({'42': {uid: 42}})
    })
  })

  describe('CHANGE_*', function() {
    it('should change the given property', function() {
      const action = changeClue(['bob'], 42)
      const newState = reducer({ 'bob': 7 }, action)
      expect(newState).to.eql({ 'bob': 42 })
    })
  })

  describe('DELETE_*', function() {
    it('should delete resource at uid', function() {
      const action = { type: at.del(Clue.type), payload: { uid: 'myuid' } }
      const newState = reducer({ myuid: 42 }, action)
      expect(newState).to.eql({})
    })
  })
})
