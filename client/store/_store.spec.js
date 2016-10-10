/* @flow */
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { testMiddleman } from '../lib/middleman'

export const createMockStore = (initialState: any, serverResponse: any) => {
  const middleware = [
    thunk,
    testMiddleman(serverResponse),
  ]
  return configureStore(middleware)(initialState)
}

const returnPromiseMiddleware = () => (next: Function) => (action: Object) => {
  next(action)
  return Promise.resolve()
}

export const createMockAPIStore = (initialState: any) => {
  const middleware = [
    thunk,
    returnPromiseMiddleware
  ]
  return configureStore(middleware)(initialState)
}
