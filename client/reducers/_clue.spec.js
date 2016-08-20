/* @flow */
import { expect } from 'chai'
import R from 'ramda'

import * as at from '../action-types'
import reducer from './clue'
import { changeClue, setClue, setAnswer, deleted, reorderAnswer } from '../actions'
import { Clue, Answer } from '../resources'

describe('Clue Reducer', function() {
  const answerUid = 'STORY:CLUE:ANSWER'
  const secondAnswerUid = 'STORY:CLUE:SECONDANSWER'
  const thirdAnswerUid = 'STORY:CLUE:THIRDANSWER'
  const startClue = Clue.new({
    uid: 'STORY:CLUE',
    storyUid: 'STORY',
    text: 'text',
    hint: 'hint',
    mediaUrl: 'media.url',
    answerUids: [answerUid, secondAnswerUid, thirdAnswerUid],
  })
  const startClues = {
    [startClue.uid]: startClue,
  }

  const newClue = Clue.new({
    uid: 'STORY:NEWCLUE',
    storyUid: 'NEWSTORY',
    text: 'new text',
    hint: 'new hint',
    mediaUrl: 'newmedia.url',
    answerUids: ['STORY:CLUE:NEW'],
  })

  describe(at.load(Clue.type), function() {
    it('should overwrite clues', function() {
      const payload = {
        [newClue.uid]: newClue,
      }
      const action = {
        type: at.load(Clue.type),
        payload
      }
      const newState = reducer(startClues, action)
      expect(newState).to.eql(payload)
    });
  });

  describe(at.change(Clue.type), function() {
    it('should change fields on clue', function() {
      const action = changeClue([startClue.uid, 'hint'], '42')
      const newState = reducer(startClues, action)
      expect(newState).to.eql({
        [startClue.uid]: {
          ...startClue,
          hint: '42',
        }
      })
      expect(newState[startClue.uid]).not.to.equal(startClue)
    });
  });

  describe(at.set(Clue.type), function() {
    it('should overwrite the clue', function() {
      const newClue = R.assoc('hint', 'new-hint', startClue)
      const action = setClue(newClue)
      const newState = reducer(startClues, action)
      expect(newState[startClue.uid]).to.eql(newClue)
    });
  });

  describe(at.set(Answer.type), function() {
    it('should add an answer to the clue', function() {
      const newAnswer = Answer.new({
        uid: 'STORY:CLUE:NEWANSWER',
        storyUid: 'STORY',
        clueUid: 'STORY:CLUE',
        pattern: 'my-pattern',
        nextClue: 'MY-NEXT-CLUE',
      })
      const action = setAnswer(newAnswer)
      const newState = reducer(startClues, action)
      expect(newState[startClue.uid].answerUids).to.contain('STORY:CLUE:NEWANSWER')
    });

    it('should not add an answer to the clue if it already exists', function() {
      const newAnswer = Answer.new({
        uid: 'STORY:CLUE:ANSWER',
        storyUid: 'STORY',
        clueUid: 'STORY:CLUE',
        pattern: 'my-pattern',
        nextClue: 'MY-NEXT-CLUE',
      })
      const action = setAnswer(newAnswer)
      const newState = reducer(startClues, action)
      expect(R.allUniq(newState[startClue.uid].answerUids)).to.be.true
    });
  });

  describe(at.del(Clue.type), function() {
    it('should delete the clue', function() {
      const action = deleted(Clue.type, startClue.uid)
      const newState = reducer(startClues, action)
      expect(newState).to.eql({})
    });
  });

  describe(at.del(Answer.type), function() {
    it('should delete the answer from answerUids', function() {
      const action = deleted(Answer.type, answerUid)
      const newState = reducer(startClues, action)
      expect(newState[startClue.uid].answerUids).to.not.contain(startClue.uid)
    });
  });

  describe(at.REORDER_ANSWER, function() {
    it("should move an answer earlier", function() {
      const action = reorderAnswer(answerUid, 2)
      const newState = reducer(startClues, action)
      expect(newState[startClue.uid].answerUids).to.eql([secondAnswerUid, thirdAnswerUid, answerUid])
    });

    it("should move an answer later", function() {
      const action = reorderAnswer(thirdAnswerUid, 1)
      const newState = reducer(startClues, action)
      expect(newState[startClue.uid].answerUids).to.eql([answerUid, thirdAnswerUid, secondAnswerUid])
    });

    it("should not move an answer when same index", function() {
      const action = reorderAnswer(secondAnswerUid, 1)
      const newState = reducer(startClues, action)
      expect(newState[startClue.uid].answerUids).to.eql([answerUid, secondAnswerUid, thirdAnswerUid])
    });
  });

});
