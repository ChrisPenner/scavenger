/* @flow */
import R from 'ramda'
import { createAction } from 'redux-actions'
import { save, del } from './api/methods'

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

export type ResourceT = {
  route: Function,
  api: {
    route: Function,
  },
  new: Function,
  type: ResourceType,
  types: {
    saga: {
      save: string,
      del: string,
    },
    save: string,
    del: string,
  },
  selectors: {
    get: Function,
    getAll: (state: Object) => {[key:string]: Object},
    getUids: (state: Object) => Array<string>,
  },
  actions: {
    saga: {
      save: () => Object,
      del: (paylaod: {uid: string}) => Object,
    },
    save: () => Object,
    del: (paylaod: { uid: string }) => Object,
  }
}

const addRoutes = ({route, ...resource}): ResourceT => {
  const baseRoute = (uid?: string) => `${route}${uid ? uid : ''}`
  return {
    ...resource,
    route: baseRoute,
    api: {
      ...(resource.api || {}),
      route: R.compose(R.concat('/api'), baseRoute),
    }
  }
}

const addSelectors = (resource): ResourceT => {
  const key = resource.type
  const selectors = {
    get: R.curry((state, uid) => R.path([key, uid], state)),
    getAll: (state) => R.prop(key, state),
    getUids: (state) => R.keys(R.prop(key, state)),

  }
  return R.assoc('selectors', selectors, resource)
}

const addRestful = (resource): ResourceT => {
  const api = resource.api || {}
  const newApi = R.compose(
    R.assoc('save', save(resource)),
    R.assoc('del', del(resource)),
    // R.assoc('save', save(resource)),
  )(api)
  return R.assoc('api', newApi, resource)
}

const addActions = (resource): ResourceT => {
  const {
    saga,
    ...standardActions
  } = resource.types

  const actions = {
    save: createAction(standardActions.save),
    fetch: createAction(standardActions.fetch),
    change: createAction(standardActions.change),
    del: createAction(standardActions.del),
    saga: {
      save: createAction(saga.save),
      fetch: createAction(saga.fetch),
      change: createAction(saga.change),
      del: createAction(saga.del),
    },
  }
  return R.assoc('actions', actions, resource)
}

const addActionTypes = (resource): ResourceT => {
  const standard = {
    save: `SAVE_${resource.type}`,
    del: `DELETE_${resource.type}`,
    fetch: `FETCH_${resource.type}`,
    change: `CREATE_${resource.type}`,
  }
  const saga = R.map(key => `BEGIN_${key}`, standard)
  const types = {
    ...standard,
    saga,
  }
  return R.assoc('types', types, resource)
}

const addInfo = (resource): ResourceT => R.compose(
  addRestful,
  addSelectors,
  addRoutes,
  addActions,
  addActionTypes,
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
