/* @flow */
import { expect } from 'chai'

import reducer from './group'

describe('Group Reducer', function() {
  it('should return a default state', function() {
    expect(reducer(undefined, {})).to.not.equal(undefined)
  })
});
