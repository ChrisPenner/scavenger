/* @flow */
import Routes from './api'

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

export type GroupType = {
  uid: string,
}

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
  route: Routes.story,
  new: storyFactory,
  type: 'STORY',
}

export const Group = {
  route: Routes.group,
  type: 'GROUP',
}

export const Clue = {
  route: Routes.clue,
  new: clueFactory,
  type: 'CLUE',
}

export const Answer = {
  route: Routes.answer,
  new: answerFactory,
  type: 'ANSWER',
}

export type ResourceType = 'STORY' | 'CLUE' | 'ANSWER' | 'GROUP'
