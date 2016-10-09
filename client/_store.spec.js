/* @flow */
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise';
import { testMiddleman } from './lib/middleman'
import { middlemanConfig } from './api'

export const createMockStore = (initialState: any, serverResponse: any, apiActions: ?Object) => {
  const middleware = [
    thunk,
    testMiddleman(serverResponse),
  ]
  return configureStore(middleware)(initialState)
}

const returnPromiseMiddleware = ({dispatch}: Object) => (next: Function) => (action: Object) => {
  next(action)
  return Promise.resolve('blah')
}

export const createAPIStore = (initialState: any) => {
  const middleware = [
    thunk,
    returnPromiseMiddleware
  ]
  return configureStore(middleware)(initialState)
}
