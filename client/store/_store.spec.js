/* @flow */
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const returnPromiseMiddleware = () => (next: Function) => (action: Object) => {
  next(action)
  return Promise.resolve()
}

export const createMockStore = (initialState: any) => {
  const middleware = [
    thunk,
    returnPromiseMiddleware,
  ]
  return configureStore(middleware)(initialState)
}
