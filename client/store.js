/* @flow */
import { createStore, applyMiddleware, compose } from 'redux'
import R from 'ramda'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import promiseMiddleware from 'redux-promise';
import { browserHistory } from 'react-router'

import reducer from './reducers'

const middleware = compose(
  applyMiddleware(promiseMiddleware, routerMiddleware(browserHistory), thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f)
const store = createStore(reducer, middleware)
const mdispatch = store.dispatch
store.dispatch = (...args) => {
  console.log(...args)
  return mdispatch(...args)
}

export default store
