/* @flow */
import { expect } from 'chai'
import R from 'ramda'
import { applyThunk } from '../lib/redux-test'

import reducer from './story'
import { createClue, dropClue } from '../actions'
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

  const testThunk = applyThunk(reducer, startStories)

  it('should return a default state', function() {
    expect(reducer(undefined, {})).to.not.equal(undefined)
  })

  describe(Clue.types.create, function() {
    it('should add a clue to the story', function() {
      const newClueUid = `${startStory.uid}:NEWCLUE`
      const newClue = Clue.new({
        uid: newClueUid,
        storyUid: startStory.uid,
        text: 'text',
        hint: 'hint',
        mediaUrl: 'media.url',
        answerUids: ['answer'],
      })
      const action = createClue(newClue)

      const newState = testThunk(startStories, action)
      expect(newState[startStory.uid].clues).to.contain(newClueUid)
    })

    it('should not add a clue to the story if it already exists', function() {
      const newClue = Clue.new({
        uid: 'STORY:CLUE',
        storyUid: 'STORY',
        text: 'text',
        hint: 'hint',
        mediaUrl: 'media.url',
        answerUids: ['answer'],
      })
      const action = createClue(newClue)
      const newState = reducer(startStories, action)
      expect(R.allUniq(newState[startStory.uid].clues)).to.be.true
    })
  })

  describe('DROP_CLUE', function() {
    it('should move a clue earlier', function() {
      const newState = testThunk({ui: {dragData: clueUid}}, dropClue(2))
      expect(newState[startStory.uid].clues).to.eql([secondClueUid, thirdClueUid, clueUid])
    })

    it('should move a clue later', function() {
      const newState = testThunk({ui: {dragData: thirdClueUid}}, dropClue(1))
      expect(newState[startStory.uid].clues).to.eql([clueUid, thirdClueUid, secondClueUid])
    })

    it('should not move a clue when same index', function() {
      const newState = testThunk({ui: {dragData: secondClueUid}}, dropClue(1))
      expect(newState[startStory.uid].clues).to.eql([clueUid, secondClueUid, thirdClueUid])
    })
  })
})
