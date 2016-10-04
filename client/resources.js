/* @flow */
import R from 'ramda'

export type StoryType = {
  uid: string,
  defaultHint: string,
  clues: Array<string>,
}

const storyFactory = (args: Object): StoryType => ({
  uid: null,
  defaultHint: '',
  clues: [],
  ...args,
})

export type CodeType = {
  storyUid: string,
  wordString: string,
  used: boolean,
  singleUse: boolean,
}

const codeFactory = (args: Object): CodeType => ({
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
  sender?: string,
  receiver?: string,
  mediaUrl?: string,
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
  new: (o:Object) => Object,
  type: string,
}

const addRoutes = ({route, ...resource}) => {
  const baseRoute = (uid: string) => `${route}${uid ? uid : ""}`
  return {
    ...resource,
    route: baseRoute,
    api: {
      route: R.compose(R.concat('/api'), baseRoute),
    }
  }
}

export const Story = addRoutes({
  type: 'STORY',
  route: '/stories/',
  new: storyFactory,
})

export const Code = addRoutes({
  type: 'CODE',
  route: '/codes/',
  new: codeFactory,
})

export const Clue = addRoutes({
  type: 'CLUE',
  route: '/clues/',
  new: clueFactory,
})

export const Answer = addRoutes({
  type: 'ANSWER',
  route: '/answers/',
  new: answerFactory,
})

export const Group = addRoutes({
  type: 'GROUP',
  route: '/groups/',
  new: groupFactory,
})

export const Message = addRoutes({
  type: 'MESSAGE',
  route: '/messages/',
  new: messageFactory,
})

export type ResourceType = 'STORY' | 'CLUE' | 'ANSWER' | 'GROUP' | 'MESSAGE' | 'CODE'
