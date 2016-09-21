/* @flow */
import { expect } from 'chai'
import R from 'ramda'

import at from '../action-types'
import reducer from './story'
import { changeStory, setStory, setClue } from '../actions'
import { Story, Clue } from '../resources'

describe('Story Reducer', function() {
  const startStory = Story.new({
    uid: 'STORY',
    defaultHint: 'my hint',
    clues: ['STORY:CLUE'],
  })
  const startStory2 = Story.new({
    uid: 'SECONDSTORY',
    defaultHint: 'my hint',
    clues: ['SECONDSTORY:CLUE'],
  })
  const startStory3 = Story.new({
    uid: 'STORY2',
    defaultHint: 'my hint',
    clues: ['STORY2:CLUE'],
  })
  const startStories = {
    [startStory.uid]: startStory,
    [startStory2.uid]: startStory2,
    [startStory3.uid]: startStory3
  }

  const newStory = Story.new({
    uid: 'NEWSTORY',
    defaultHint: 'my new hint',
    clues: ['NEWSTORY:NEWCLUE'],
  })

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
        },
        [startStory2.uid]: {
          ...startStory2
        },
        [startStory3.uid]: {
          ...startStory3
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

  describe(at.del(Story.type), function() {
    it('should have the list minus the deleted item', function() {
      const action = {type: at.del(Story.type), payload: {uid: startStory3.uid}}
      const newState = reducer(startStories, action)
      expect(newState).to.eql({
        [startStory2.uid]: {
          ...startStory2
        },
        [startStory.uid]: {
          ...startStory
        },
      })
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
});
