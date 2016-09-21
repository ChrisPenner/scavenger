/* @flow */
import { expect } from 'chai'
import R from 'ramda'
import { applyThunk } from '../lib/redux-test'

import at from '../action-types'
import reducer from './story'
import { changeStory, setStory, setClue, dropClue } from '../actions'
import { Story, Clue } from '../resources'

describe('Story Reducer', function() {
  const clueUid = 'STORY:CLUE1'
  const secondClueUid = 'STORY:CLUE2'
  const thirdClueUid = 'STORY:CLUE3'
  const startStory = Story.new({
    uid: 'STORY',
    defaultHint: 'my hint',
    clues: [clueUid, secondClueUid, thirdClueUid],
  })
  const startStories = {
    [startStory.uid]: startStory,
  }

  const newStory = Story.new({
    uid: 'NEWSTORY',
    defaultHint: 'my new hint',
    clues: ['NEWSTORY:NEWCLUE'],
  })

  const testThunk = applyThunk(reducer, startStories)

  it('should return a default state', function() {
    expect(reducer(undefined, {})).to.not.equal(undefined)
  })

  describe(at.load(Story.type), function() {
    it('should overwrite stories', function() {
      const payload = {
        [newStory.uid]: newStory,
      }
      const action = {
        type: at.load(Story.type),
        payload
      }
      const newState = reducer(startStories, action)
      expect(newState).to.eql(payload)
    });
  });

  describe(at.change(Story.type), function() {
    it('should change fields on story', function() {
      const action = changeStory([startStory.uid, 'defaultHint'], '42')
      const newState = reducer(startStories, action)
      expect(newState).to.eql({
        [startStory.uid]: {
          ...startStory,
          defaultHint: '42',
        }
      })
      expect(newState[startStory.uid]).not.to.equal(startStory)
    });
  });

  describe(at.set(Story.type), function() {
    it('should overwrite the story', function() {
      const newStory = R.assoc('defaultHint', 'new-hint', startStory)
      const action = setStory(newStory)
      const newState = reducer(startStories, action)
      expect(newState[startStory.uid]).to.eql(newStory)
    });
  });

  describe(at.set(Clue.type), function() {
    it('should add a clue to the story', function() {
      const newClue = Clue.new({
        uid: 'STORY:NEWCLUE',
        storyUid: 'STORY',
        text: 'text',
        hint: 'hint',
        mediaUrl: 'media.url',
        answerUids: ['answer'],
      })
      const action = setClue(newClue)
      const newState = reducer(startStories, action)
      expect(newState[startStory.uid].clues).to.contain('STORY:NEWCLUE')
    });

    it('should not add a clue to the story if it already exists', function() {
      const newClue = Clue.new({
        uid: 'STORY:CLUE',
        storyUid: 'STORY',
        text: 'text',
        hint: 'hint',
        mediaUrl: 'media.url',
        answerUids: ['answer'],
      })
      const action = setClue(newClue)
      const newState = reducer(startStories, action)
      expect(R.allUniq(newState[startStory.uid].clues)).to.be.true
    });
  });

  describe('DROP_CLUE', function() {
    it("should move a clue earlier", function() {
      const newState = testThunk({ui: {dragData: clueUid}}, dropClue(2))
      expect(newState[startStory.uid].clues).to.eql([secondClueUid, thirdClueUid, clueUid])
    });

    it("should move a clue later", function() {
      const newState = testThunk({ui: {dragData: thirdClueUid}}, dropClue(1))
      expect(newState[startStory.uid].clues).to.eql([clueUid, thirdClueUid, secondClueUid])
    });

    it("should not move a clue when same index", function() {
      const newState = testThunk({ui: {dragData: secondClueUid}}, dropClue(1))
      expect(newState[startStory.uid].clues).to.eql([clueUid, secondClueUid, thirdClueUid])
    });
  });
});
