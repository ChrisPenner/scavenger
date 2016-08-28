/* @flow */
import R from 'ramda'
import { expect } from 'chai'
import { createMockStore } from '../_store.spec.js'

import at from '../action-types'
import { saveStory, setStory } from './'
import { Story } from '../resources'
import { createToast, CREATE_TOAST } from '../lib/wisp'

const fakeResource = { uid: 'myuid', value: 42 }
const initStore = createMockStore({ PUT: () => Promise.resolve(fakeResource)})
describe('Actions', function() {
  describe('saveResource', function() {
    it('should set resource and trigger success notification', function(done) {
      const store = initStore({ stories: {[fakeResource.uid]: fakeResource }})
      store.dispatch(saveStory(fakeResource.uid)).then(() => {
        const actions = store.getActions()
        const actionTypes = R.pluck('type', actions)
        const [setAction, toastAction] = actions
        const actualToast = R.dissoc('id', toastAction.payload)
        const expectedToast = R.dissoc('id', createToast({ id: '4', title: 'Saved', type: "success", message: undefined }).payload)

        expect(actionTypes).to.eql([at.set(Story.type), CREATE_TOAST])
        expect(setAction).to.eql(setStory(fakeResource))
        expect(actualToast).to.eql(expectedToast)
      }).then(done).catch(done)
    })
  });
})
