import { expect } from 'chai'
import * as at from 'action-types'
import reducer from './clue'
import { changeClue, setClue } from 'actions'
import { Clue } from 'resources'

describe('Clue Reducer', function() {
  const startClue = Clue.new({
    uid: 'STORY:CLUE',
    storyUid: 'STORY',
    text: 'text',
    hint: 'hint',
    mediaUrl: 'media.url',
    answers: ['answer'],
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
    answers: ['new'],
  })

  describe(at.LOAD_CLUES, function() {
    it('should overwrite clues', function() {
      const payload = {
        [newClue.uid]: newClue,
      }
      const action = {
        type: at.LOAD_CLUES,
        payload
      }
      const newState = reducer(startClues, action)
      expect(newState).to.eql(payload)
    });
  });

  describe(at.CHANGE_CLUE, function() {
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

  describe(at.SET_CLUE, function() {
    it('should overwrite the clue', function() {
      const newClue = R.assoc('hint', 'new-hint', startClue)
      const action = setClue(newClue)
      const newState = reducer(startClues, action)
      expect(newState[startClue.uid]).to.eql(newClue)
    });
  });
});
