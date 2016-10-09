/* @flow */
import { expect } from 'chai'
import R from 'ramda'
import { applyThunk } from '../lib/redux-test'

import at from '../action-types'
import reducer from './clue'
import { saveAnswer, dropAnswer } from '../actions'
import { Clue, Answer, Story } from '../resources'

describe('Clue Reducer', function() {
  const answerUid = 'STORY:CLUE:ANSWER'
  const secondAnswerUid = 'STORY:CLUE:SECONDANSWER'
  const thirdAnswerUid = 'STORY:CLUE:THIRDANSWER'
  const startClue: Object = Clue.new({
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

  const testThunk = applyThunk(reducer, startClues)

  it('should return a default state', function() {
    expect(reducer(undefined, {})).to.not.equal(undefined)
  })

  describe(at.save(Answer.type), function() {
    it('should add an answer to the clue', function() {
      const newAnswer = Answer.new({
        uid: 'STORY:CLUE:NEWANSWER',
        storyUid: 'STORY',
        clueUid: 'STORY:CLUE',
        pattern: 'my-pattern',
        nextClue: 'MY-NEXT-CLUE',
      })
      const action = saveAnswer(newAnswer)
      const newState = testThunk(startClues, action)
      expect(newState[startClue.uid].answerUids).to.contain('STORY:CLUE:NEWANSWER')
    })

    it('should add an answer to the clue', function() {
      const newAnswer = Answer.new({
        uid: 'STORY:CLUE:NEWANSWER',
        storyUid: 'STORY',
        clueUid: 'STORY:CLUE',
        pattern: 'my-pattern',
        nextClue: 'MY-NEXT-CLUE',
      })
      const action = saveAnswer(newAnswer)
      const newState = testThunk(startClues, action)
      expect(newState[startClue.uid].answerUids).to.contain('STORY:CLUE:NEWANSWER')
    })


    it('should not add an answer to the clue if it already exists', function() {
      const newAnswer = Answer.new({
        uid: 'STORY:CLUE:ANSWER',
        storyUid: 'STORY',
        clueUid: 'STORY:CLUE',
        pattern: 'my-pattern',
        nextClue: 'MY-NEXT-CLUE',
      })
      const action = saveAnswer(newAnswer)
      const newState = reducer(startClues, action)
      expect(R.allUniq(newState[startClue.uid].answerUids)).to.be.true
    })
  })

  describe(at.del(Story.type), function() {
    it('should delete the clue if its story is deleted', function() {
      const action = {type: at.del(Story.type), payload: {uid: startClue.storyUid}}
      const newState = reducer(startClues, action)
      expect(newState).to.eql({})
    })
  })

  describe(at.del(Answer.type), function() {
    it('should delete the answer from answerUids', function() {
      const action = {type: at.del(Answer.type), payload: {uid: answerUid}}
      const newState = reducer(startClues, action)
      expect(newState[startClue.uid].answerUids).to.not.contain(answerUid)
    })
  })

  describe('DROP_ANSWER', function() {
    it('should move an answer earlier', function() {
      const newState = testThunk({ui: {dragData: answerUid}}, dropAnswer(2))
      expect(newState[startClue.uid].answerUids).to.eql([secondAnswerUid, thirdAnswerUid, answerUid])
    })

    it('should move an answer later', function() {
      const newState = testThunk({ui: {dragData: thirdAnswerUid}}, dropAnswer(1))
      expect(newState[startClue.uid].answerUids).to.eql([answerUid, thirdAnswerUid, secondAnswerUid])
    })

    it('should not move an answer when same index', function() {
      const newState = testThunk({ui: {dragData: secondAnswerUid}}, dropAnswer(1))
      expect(newState[startClue.uid].answerUids).to.eql([answerUid, secondAnswerUid, thirdAnswerUid])
    })
  })

})
