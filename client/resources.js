/* @flow */
import APIRoutes from './api'

export type StoryType = {
  uid: string,
  defaultHint: string,
  defaultEnd: string,
  allowsGroups: boolean,
  clues: Array<string>,
}

const storyFactory = (args: Object): StoryType => ({
  uid: null,
  defaultHint: '',
  defaultEnd: '',
  allowsGroups: '',
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
  mediaUrl: string,
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
  new: (o:Object) => Object,
  type: string,
}

export const Story = {
  route: APIRoutes.story,
  new: storyFactory,
  type: 'STORY',
}

export const Code = {
  route: APIRoutes.code,
  new: storyCodeFactory,
  type: 'CODE',
}

export const Clue = {
  route: APIRoutes.clue,
  new: clueFactory,
  type: 'CLUE',
}

export const Answer = {
  route: APIRoutes.answer,
  new: answerFactory,
  type: 'ANSWER',
}

export const Group = {
  route: APIRoutes.group,
  new: groupFactory,
  type: 'GROUP',
}

export const Message = {
  route: APIRoutes.messages,
  new: messageFactory,
  type: 'MESSAGE',
}

export type ResourceType = 'STORY' | 'CLUE' | 'ANSWER' | 'GROUP' | 'MESSAGE' | 'CODE'
