/* @flow */
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

export type StoryCodeType = {
  storyUid: string,
  wordString: string,
  used: boolean,
  singleUse: boolean,
}

const storyCodeFactory = (args: Object): StoryType => ({
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
  index: Function,
  new: (o:Object) => Object,
  type: string,
}

const addRoutes = ({baseRoute, ...resource}) => ({
  ...resource,
  index: () => baseRoute,
  route: (uid: string) => `${baseRoute}${uid}`,
})

export const Story = addRoutes({
  type: 'STORY',
  baseRoute: '/api/stories/',
  new: storyFactory,
})

export const Code = addRoutes({
  type: 'CODE',
  baseRoute: '/api/codes/',
  new: storyCodeFactory,
})

export const Clue = addRoutes({
  type: 'CLUE',
  baseRoute: '/api/clues/',
  new: clueFactory,
})

export const Answer = addRoutes({
  type: 'ANSWER',
  baseRoute: '/api/answers/',
  new: answerFactory,
})

export const Group = addRoutes({
  type: 'GROUP',
  baseRoute: '/api/groups/',
  new: groupFactory,
})

export const Message = addRoutes({
  type: 'MESSAGE',
  baseRoute: '/api/messages/',
  new: messageFactory,
})

export type ResourceType = 'STORY' | 'CLUE' | 'ANSWER' | 'GROUP' | 'MESSAGE' | 'CODE'
