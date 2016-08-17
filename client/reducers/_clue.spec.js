import { expect } from 'chai'
import * as at from 'action-types'
import reducer from './clue'
import { changeClue, setClue, setAnswer } from 'actions'
import { Clue, Answer } from 'resources'

describe('Clue Reducer', function() {
  const startClue = Clue.new({
    uid: 'STORY:CLUE',
    storyUid: 'STORY',
    text: 'text',
    hint: 'hint',
    mediaUrl: 'media.url',
    answerUids: ['answer'],
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
    answerUids: ['new'],
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
        uid: 'STORY:CLUE:ANSWER',
        storyUid: 'STORY',
        clueUid: 'STORY:CLUE',
        pattern: 'my-pattern',
        nextClue: 'MY-NEXT-CLUE',
      })
      const action = setAnswer(newAnswer)
      const newState = reducer(startClues, action)
      expect(newState[startClue.uid].answerUids).to.contain('STORY:CLUE:ANSWER')
    });
  });
});
