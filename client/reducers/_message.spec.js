/* @flow */
import { expect } from 'chai'

import at from '../action-types'
import reducer from './message'
import { Message } from '../resources'

describe('Message Reducer', function() {
  const newMessage = Message.new({
    uid: "message"
  })
  const startMessages = {
  }

  it('should return a default state', function() {
    expect(reducer(undefined, {})).to.not.equal(undefined)
  })

  describe(at.fetch(Message.type), function() {
    it('should overwrite messages', function() {
      const payload = {
        [newMessage.uid]: newMessage,
      }
      const action = {
        type: at.fetch(Message.type),
        payload
      }
      const newState = reducer(startMessages, action)
      expect(newState).to.eql(payload)
    });
  });
});
