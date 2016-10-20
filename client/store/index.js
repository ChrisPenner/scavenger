/* @flow */
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import {middleware as apiMiddleware} from '../api'
import { browserHistory } from 'react-router'

import reducer from '../reducers'
import sagas from '../sagas'

const sagaMiddleware = createSagaMiddleware()

const middleware = compose(
  applyMiddleware(
    sagaMiddleware,
    apiMiddleware,
    routerMiddleware(browserHistory),
    thunk,
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f)
const store = createStore(reducer, middleware)

// Kick off sagas
sagaMiddleware.run(sagas)

export default store
