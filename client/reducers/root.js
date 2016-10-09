/* @flow */
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import stories from './story'
import codes from './code'
import clues from './clue'
import answers from './answer'
import groups from './group'
import messages from './message'
import explorer from './explorer'
import ui from './ui'
import tools from './tools'
import { wispReducer } from '../lib/wisp'
import { reducer as api } from '../lib/middleman'

export default combineReducers({
  routing: routerReducer,
  stories,
  codes,
  clues,
  answers,
  explorer,
  groups,
  messages,
  tools,
  ui,
  toasts: wispReducer,
  api,
})

