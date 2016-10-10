/* @flow */
import { expect } from 'chai'

import at from '../actions/types'
import reducer from './answer'
import { Answer, Clue, Story } from '../resources'

describe('Answer Reducer', function() {
  const startAnswer: Object = Answer.new({
    uid: 'STORY:CLUE:ANSWER',
    storyUid: 'STORY',
    clueUid: 'STORY:CLUE',
    pattern: 'my-pattern',
    nextClue: 'STORY:MY-NEXT-CLUE',
  })
  const startAnswers = {
    [startAnswer.uid]: startAnswer,
  }

  it('should return a default state', function() {
    expect(reducer(undefined, {})).to.not.equal(undefined)
  })

  describe(at.del(Clue.type), function() {
    it('should delete the answer if its clue is deleted', function() {
      const action = {type: at.del(Clue.type), payload: {uid: startAnswer.clueUid}}
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql({})
    })
  })

  describe(at.del(Story.type), function() {
    it('should delete the answer if its story is deleted', function() {
      const action = {type: at.del(Story.type), payload: {uid: startAnswer.storyUid}}
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql({})
    })
  })
})
