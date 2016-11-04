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
import { wispReducer } from 'wisp-react-redux'
import { reducer as api } from '../api'
import { Story, Clue, Code, Answer, Group, Message } from '../resources'
import type { StoryState } from './story'
import type { ClueState } from './clue'
import type { AnswerState } from './answer'
import type { GroupState } from './group'
import type { MessageState } from './message'
import type { CodeState } from './code'
import type { ExplorerState } from './explorer'
import type { ToolsState } from './tools'
import type { UIState } from './ui'
// import type { WispState } from 'wisp-react-redux'
import type { APIState } from '../api'

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
  ui,
  wisps: wispReducer,
  api,
})

export type State = {
  Story: StoryState,
  Clue: ClueState,
  Answer: AnswerState,
  Group: GroupState,
  Message: MessageState,
  Code: CodeState,
  routing: any,
  explorer: ExplorerState,
  tools: ToolsState,
  ui: UIState,
  toasts: any,
  api: APIState,

}
