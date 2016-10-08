/* @flow */
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise';
import { testMiddleman } from './lib/middleman'
import { middlemanConfig } from './api'

export const createMockStore = (initialState: any, serverResponse: any) => {
  const middleware = [
    testMiddleman(serverResponse)(middlemanConfig),
    thunk,
  ]
  return configureStore(middleware)(initialState)
}
