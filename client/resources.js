/* @flow */
import R from 'ramda'

import type {State} from './reducers'
export type ResourceType = string

export type StoryType = {
  uid: string,
  defaultHint: string,
  endMessage: string,
  clues: Array<string>,
}

const storyFactory = (args: Object): StoryType => ({
  uid: null,
  defaultHint: '',
  endMessage: '',
  clues: [],
  ...args,
})

export type CodeType = {
  uid: string,
  storyUid: string,
  wordString: string,
  used: boolean,
  singleUse: boolean,
}

const codeFactory = (args: Object): CodeType => ({
  uid: null,
  storyUid: '',
  wordString: '',
  used: false,
  singleUse: true,
  ...args,
})

export type GroupType = {
  uid: string,
  storyUid: string,
  clueUid: string,
  createdAt: string,
  completedAt: string,
}

const groupFactory = (args: Object): GroupType => ({
  uid: null,
  storyUid: '',
  clueUid: '',
  createdAt: '',
  completedAt: '',
  ...args,
})

export type MessageType = {
  uid: string,
  storyUid: string,
  groupUid: string,
  text: string,
  sent: string,
  sender?: string,
  receiver?: string,
  mediaUrl?: string,
  source? : string,
}

const messageFactory = (args: Object): MessageType => ({
  uid: null,
  storyUid: '',
  groupUid: '',
  text: '',
  sender: '',
  receiver: '',
  mediaUrl: undefined,
  ...args,
})

export type ClueType = {
  uid: string,
  storyUid: string,
  hint: string,
  mediaUrl?: string,
  answerUids: Array<string>,
}

const clueFactory = (args: Object): ClueType => ({
  uid: null,
  storyUid: null,
  text: '',
  hint: '',
  mediaUrl: '',
  answerUids: [],
  ...args,
})

export type AnswerType = {
  uid: string,
  storyUid: string,
  clueUid: string,
  pattern: string,
  nextClue: string,
}

const answerFactory = (args: Object): AnswerType => ({
  uid: null,
  storyUid: null,
  clueUid: null,
  pattern: '',
  nextClue: '',
  ...args,
})

export type ResourceT<K> = {
  route: (uid:?string) => string,  
  api: {
    route: (uid:?string) => string,
  },
  new: Function,
  type: ResourceType,
  selectors: {
    get: (state: State) => K,
    getAll: (state: Object) => {[key:string]: K},
    getUids: (state: Object) => Array<string>,
  },
  types: {
    del: string,
    save: string,
    fetch: string,
    change: string,
    create: string,
    init: string,
  }
}

const addRoutes = ({route, ...resource}): ResourceT<*> => {
  const baseRoute = (uid?: string) => `${route}${uid ? uid : ''}`
  return {
    ...resource,
    route: baseRoute,
    api: {
      route: R.compose(R.concat('/api'), baseRoute),
    }
  }
}

const addSelectors = (resource): ResourceT<*> => {
  const key = resource.type
  const selectors = {
    get: R.curry((state, uid) => R.path([key, uid], state)),
    getAll: (state) => R.prop(key, state),
    getUids: (state) => R.keys(R.prop(key, state)),
  }
  return R.assoc('selectors', selectors, resource)
}

const addTypes = (resource): ResourceT<*> => {
  const type = resource.type
  const types = {
    del: `DELETE_${type}`,
    save: `SAVE_${type}`,
    fetch: `FETCH_${type}`,
    change: `CHANGE_${type}`,
    create: `CREATE_${type}`,
    init: `INIT_${type}`,
  }
  return R.assoc('types', types, resource)
}

const addInfo = (resource): ResourceT<*> => R.compose(
  addTypes,
  addSelectors,
  addRoutes
)(resource)


export const Story = addInfo({
  type: 'STORY',
  route: '/stories/',
  new: storyFactory,
})

export const Code = addInfo({
  type: 'CODE',
  route: '/codes/',
  new: codeFactory,
})

export const Clue = addInfo({
  type: 'CLUE',
  route: '/clues/',
  new: clueFactory,
})

export const Answer = addInfo({
  type: 'ANSWER',
  route: '/answers/',
  new: answerFactory,
})

export const Group = addInfo({
  type: 'GROUP',
  route: '/groups/',
  new: groupFactory,
})

export const Message = addInfo({
  type: 'MESSAGE',
  route: '/messages/',
  new: messageFactory,
})
