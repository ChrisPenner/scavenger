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
import tools from './tools'
import { wispReducer } from '../lib/wisp'
import { reducer as api } from '../api'
import { Story, Clue, Code, Answer, Group, Message } from '../resources'

export default combineReducers({
  [Story.type]: stories,
  [Clue.type]: clues,
  [Answer.type]: answers,
  [Group.type]: groups,
  [Message.type]: messages,
  [Code.type]: codes,
  routing: routerReducer,
  explorer,
  tools,
  toasts: wispReducer,
  api,
})

