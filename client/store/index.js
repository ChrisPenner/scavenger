/* @flow */
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import apiMiddleware from '../api'
import { browserHistory } from 'react-router'

import reducer from '../reducers/root'

const middleware = compose(
  applyMiddleware(
    apiMiddleware,
    routerMiddleware(browserHistory),
    thunk,
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f)
const store = createStore(reducer, middleware)

export default store
