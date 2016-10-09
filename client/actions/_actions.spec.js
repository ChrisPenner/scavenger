/* @flow */
import R from 'ramda'
import { expect } from 'chai'
import { createMockStore, createMockAPIStore } from '../_store.spec.js'
import { CALL_HISTORY_METHOD } from 'react-router-redux'

import at from '../action-types'
import { saveStory, createStory, dropAnswer, dropClue} from './'
import { Story } from '../resources'
import {  CREATE_TOAST } from '../lib/wisp'

describe('Actions', function() {
  const initialState = {}
  const store = createMockAPIStore(initialState)
  beforeEach(() => store.clearActions())

  describe('saveResource', function() {
    it('should send save action and trigger success notification', function(done) {
      store.dispatch(saveStory('my-uid')).then(() => {
        const actions = store.getActions()
        const types = R.map(R.prop('type'), actions)
        expect(types).to.eql([at.save(Story.type), CREATE_TOAST])
      }).then(done).catch(done)
    })
  })

  describe('createResource', function() {
    it('should send create action and trigger success notification', function(done) {
      store.dispatch(createStory('my-uid')).then(() => {
        const actions = store.getActions()
        const types = R.map(R.prop('type'), actions)
        expect(types).to.eql([at.create(Story.type), CALL_HISTORY_METHOD, CREATE_TOAST])
      }).then(done).catch(done)
    })
  })

  describe('dropAnswer', function() {
    it('should dispatch DROP_ANSWER with uid from dropData', function() {
      const store = createMockStore({ui: {dragData: 42}})
      store.dispatch(dropAnswer(1))
      const actions = store.getActions()
      expect(actions).to.eql([{ type: at.DROP_ANSWER, payload: {uid: 42, index: 1} }])
    })
  })

  describe('dropClue', function() {
    it('should dispatch DROP_CLUE with uid from dropData', function() {
      const store = createMockStore({ui: {dragData: 42}})
      store.dispatch(dropClue(1))
      const actions = store.getActions()
      expect(actions).to.eql([{ type: at.DROP_CLUE, payload: {uid: 42, index: 1} }])
    })
  })

})
