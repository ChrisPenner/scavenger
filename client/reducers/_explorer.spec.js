/* @flow */
import { expect } from 'chai'

import reducer from './explorer'

describe('Explorer Reducer', function() {

  it('should return a default state', function() {
    expect(reducer(undefined, {})).to.not.equal(undefined)
  })

});
