/* @flow */
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise';
import { testMiddleman } from './lib/middleman'

export const createMockStore = (initialState: any, serverResponse: any) => {
  const middleware = [
    testMiddleman(serverResponse),
    promiseMiddleware,
    thunk,
  ]
  return configureStore(middleware)(initialState)
}
