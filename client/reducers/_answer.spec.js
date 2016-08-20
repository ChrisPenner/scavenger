/* @flow */
import { expect } from 'chai'
import R from 'ramda'

import * as at from '../action-types'
import reducer from './answer'
import { changeAnswer, setAnswer, deleted } from '../actions'
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

  describe(at.load(Answer.type), function() {
    it('should overwrite answers', function() {
      const payload = {
        [newAnswer.uid]: newAnswer,
      }
      const action = {
        type: at.load(Answer.type),
        payload
      }
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql(payload)
    });
  });

  describe(at.change(Answer.type), function() {
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

  describe(at.set(Answer.type), function() {
    it('should overwrite the answer', function() {
      const newAnswer = R.assoc('pattern', 'new-pattern', startAnswer)
      const action = setAnswer(newAnswer)
      const newState = reducer(startAnswers, action)
      expect(newState[startAnswer.uid]).to.eql(newAnswer)
    });
  });

  describe(at.del(Answer.type), function() {
    it('should delete the answer', function() {
      const action = deleted(Answer.type, startAnswer.uid)
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql({})
    });
  });

  describe(at.del(Clue.type), function() {
    it("should delete the answer if it's clue is deleted", function() {
      const action = deleted(Clue.type, startAnswer.clueUid)
      const newState = reducer(startAnswers, action)
      expect(newState).to.eql({})
    });
  });
});
