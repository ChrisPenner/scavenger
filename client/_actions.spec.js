import assert from 'assert'
import { expect } from 'chai'

import * as at from './action-types'
import {
  receiveMessage,
  sendMessage,
  addStory,
  addClue,
  addAnswer,
  setStory,
  setClue,
  setAnswer,
  changeStory,
  changeClue,
  changeAnswer,
  changeExplorer,
} from './actions'

describe("Action Creators ->", () => {
  describe("receiveMessage", () => {
    it("returns an action with the message embedded", () => {
      const message = {
        text: "my-message"
      };
      const action = receiveMessage(message)
      expect(action.message).to.equal(message)
      expect(action.type).to.equal(at.RECEIVE_MESSAGE)
    })
  })

  const testPayloadAndType = (actionCreator, type) => {
    it("returns an action with the proper type", () => {
      expect(actionCreator({}).type).to.equal(type)
    })
    it("returns an action with the proper payload", () => {
      const payload = { message: 'my-message' }
      expect(actionCreator(payload).payload).to.equal(payload)
    })
  }

  const testChanger = (changer, type) => {
    it("returns an action with the proper type", () => {
      expect(changer({}).type).to.equal(type)
    })
    it("returns an action with the proper path and value", () => {
      const { path, value } = changer('path', 'value')
      expect(path).to.equal(path)
      expect(value).to.equal('value')
    })
  }

  describe("adders ->", () => {
    describe("addStory", () => testPayloadAndType(addStory, at.ADD_STORY))
    describe("addClue", () => testPayloadAndType(addClue, at.ADD_CLUE))
    describe("addStory", () => testPayloadAndType(addAnswer, at.ADD_ANSWER))
  })

  describe("setters ->", () => {
    describe("setStory", () => testPayloadAndType(setStory, at.SET_STORY))
    describe("setClue", () => testPayloadAndType(setClue, at.SET_CLUE))
    describe("setStory", () => testPayloadAndType(setAnswer, at.SET_ANSWER))
  })

  describe("changers ->", () => {
    describe("changeStory", () => testChanger(changeStory, at.CHANGE_STORY))
    describe("changeClue", () => testChanger(changeClue, at.CHANGE_CLUE))
    describe("changeStory", () => testChanger(changeAnswer, at.CHANGE_ANSWER))
    describe("changeExplorer", () => testChanger(changeExplorer, at.CHANGE_EXPLORER))
  })
})
