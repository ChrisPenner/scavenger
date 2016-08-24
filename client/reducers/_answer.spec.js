/* @flow */
import { expect } from 'chai'
import R from 'ramda'

import at from '../action-types'
import reducer from './answer'
import { changeAnswer, setAnswer } from '../actions'
import { Answer, Clue } from '../resources'

describe('Answer Reducer', function() {
  const startAnswer = Answer.new({
    uid: 'STORY:CLUE:ANSWER',
    storyUid: 'STORY',
    clueUid: 'STORY:CLUE',
    pattern: 'my-pattern',
    nextClue: 'STORY:MY-NEXT-CLUE',
  })
  const startAnswers = {
    [startAnswer.uid]: startAnswer,
  }

  const newAnswer = Answer.new({
    uid: 'STORY:NEWCLUE:NEWANSWER',
    storyUid: 'NEWSTORY',
    clueUid: 'STORY:NEWCLUE',
    pattern: 'new pattern',
    nextClue: 'STORY:NEW-NEXT-CLUE',
  })

  it('should return a default state', function() {
    expect(reducer(undefined, {})).to.not.equal(undefined)
  })

  describe(at.LOAD_ANSWER, function() {
    it('should overwrite answers', function() {
      const payload = {
        [newAnswer.uid]: newAnswer,
      }
      const action = {
        type: at.LOAD_ANSWER,
        payload
      }
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql(payload)
    });
  });

  describe(at.CHANGE_ANSWER, function() {
    it('should change fields on answer', function() {
      const action = changeAnswer([startAnswer.uid, 'pattern'], '42')
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql({
        [startAnswer.uid]: {
          ...startAnswer,
          pattern: '42',
        }
      })
      expect(newState[startAnswer.uid]).not.to.equal(startAnswer)
    });
  });

  describe(at.SET_ANSWER, function() {
    it('should overwrite the answer', function() {
      const newAnswer = R.assoc('pattern', 'new-pattern', startAnswer)
      const action = setAnswer(newAnswer)
      const newState = reducer(startAnswers, action)
      expect(newState[startAnswer.uid]).to.eql(newAnswer)
    });
  });

  describe(at.DELETE_ANSWER, function() {
    it('should delete the answer', function() {
      const action = {type: at.DELETE_ANSWER, payload: {uid: startAnswer.uid}}
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql({})
    });
  });

  describe(at.DELETE_CLUE, function() {
    it("should delete the answer if it's clue is deleted", function() {
      const action = {type: at.DELETE_CLUE, payload: {uid: startAnswer.clueUid}}
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql({})
    });
  });
});
