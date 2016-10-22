/* @flow */
import { expect } from 'chai'

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

  describe(Clue.types.del, function() {
    it('should delete the answer if its clue is deleted', function() {
      const action = {type: Clue.types.del, payload: {uid: startAnswer.clueUid}}
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql({})
    })
  })

  describe(Story.types.del, function() {
    it('should delete the answer if its story is deleted', function() {
      const action = {type: Story.types.del, payload: {uid: startAnswer.storyUid}}
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql({})
    })
  })
})
