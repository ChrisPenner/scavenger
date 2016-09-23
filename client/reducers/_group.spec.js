/* @flow */
import { expect } from 'chai'

import at from '../action-types'
import reducer from './group'
import { Group } from '../resources'

describe('Group Reducer', function() {
  const newGroup = Group.new({
    uid: "group"
  })
  const startGroups = {
  }

  it('should return a default state', function() {
    expect(reducer(undefined, {})).to.not.equal(undefined)
  })

  describe(at.load(Group.type), function() {
    it('should overwrite groups', function() {
      const payload = {
        [newGroup.uid]: newGroup,
      }
      const action = {
        type: at.load(Group.type),
        payload
      }
      const newState = reducer(startGroups, action)
      expect(newState).to.eql(payload)
    });
  });
});
