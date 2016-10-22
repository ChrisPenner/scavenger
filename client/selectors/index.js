/* @flow */
import R from 'ramda'

import { Story, Clue, Answer, Message, Group } from '../resources'
import type { ClueType, AnswerType, GroupType, MessageType } from '../resources'

import type { ExplorerState } from '../reducers/explorer'
import type { ToolsState } from '../reducers/tools'
import type { State } from '../reducers'

export const getClueUidsByStory = (state: State, storyUid: string): Array<string> => Story.selectors.get(state, storyUid).clues
export const getCluesByStory = (state: State, storyUid: string): Array<ClueType> => {
  return getClueUidsByStory(state, storyUid).map(clueUid => Clue.selectors.get(state, clueUid))
}

export const descendingSort = (field: string) => R.comparator((d1, d2) => d1[field] > d2[field])
export const getGroupsList = (state: State): Array<GroupType> => {
  return R.sort(descendingSort('createdAt'), R.values(Group.selectors.getAll(state)))
}

export const getAnswersByClue = (state: State, clueUid: string): Array<AnswerType> => {
  return Clue.selectors.get(state, clueUid).answerUids.map(Answer.selectors.get(state))
}
export const getAnswersListByClue = (state: State, clueUid: string): Array<AnswerType> => {
  return getAnswersByClue(state, clueUid)
}

export const getGroupMessages = (state: State, groupUid: string): Array<MessageType> => {
  const isFromGroup = R.compose(R.equals(groupUid), R.prop('groupUid'))
  return R.compose(
    R.sort(descendingSort('sent')),
    R.values,
    R.pickBy(isFromGroup),
    Message.selectors.getAll
  )(state)
}

export const getStoryMessages = (state: State, storyUid: string): Array<MessageType> => {
  const isFromStory = R.compose(R.equals(storyUid), R.prop('storyUid'))
  return R.compose(
    R.sort(descendingSort('sent')),
    R.values,
    R.pickBy(isFromStory),
    Message.selectors.getAll
  )(state)
}

export const getExplorer = (state: State): ExplorerState => state.explorer

export const getToolData = (state: State): ToolsState => state.tools

export const getDragData = (state: State): any => R.path(['ui', 'dragData'], state)
