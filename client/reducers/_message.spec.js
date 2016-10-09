/* @flow */
import { expect } from 'chai'

import reducer from './message'

describe('Message Reducer', function() {

  it('should return a default state', function() {
    expect(reducer(undefined, {})).to.not.equal(undefined)
  })

})
