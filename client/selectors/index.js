/* @flow */
import R from 'ramda'

import { Story, Clue, Answer, Message, Group } from '../resources'
import type { ClueType, AnswerType, GroupType, MessageType } from '../resources'

import type { ExplorerType } from '../reducers/explorer'
import type { ToolsType } from '../reducers/tools'

export type MapOf<T> = {[uid:string]: T}
function listFromMapping<T> (mapping: MapOf<T>): Array<T> {
  return Object.keys(mapping).map(key => mapping[key])
}

export const getClueUidsByStory = (state: Object, storyUid: string): Array<string> => Story.selectors.get(state, storyUid).clues
export const getCluesByStory = (state: Object, storyUid: string): Array<ClueType> => {
  return getClueUidsByStory(state, storyUid).map(clueUid => Clue.selectors.get(state, clueUid))
}

export const descendingSort = (field: string) => R.comparator((d1, d2) => d1[field] > d2[field])
export const getGroupsList = (state: Object): Array<GroupType> => {
  return R.sort(descendingSort('createdAt'), listFromMapping(Group.selectors.getAll(state)))
}

export const getAnswersByClue = (state: Object, clueUid: string): Array<AnswerType> => {
  return Clue.selectors.get(state, clueUid).answerUids.map(Answer.selectors.get(state))
}
export const getAnswersListByClue = (state: Object, clueUid: string): Array<AnswerType> => {
  return getAnswersByClue(state, clueUid)
}

export const getGroupMessages = (state: Object, groupUid: string): Array<MessageType> => {
  const isFromGroup = R.compose(R.equals(groupUid), R.prop('groupUid'))
  return R.compose(
    R.sort(descendingSort('sent')),
    R.values,
    R.pickBy(isFromGroup),
    Message.selectors.getAll
  )(state)
}

export const getStoryMessages = (state: Object, storyUid: string): Array<MessageType> => {
  const isFromStory = R.compose(R.equals(storyUid), R.prop('storyUid'))
  return R.compose(
    R.sort(descendingSort('sent')),
    R.values,
    R.pickBy(isFromStory),
    Message.selectors.getAll
  )(state)
}

export const getExplorer = (state: Object): ExplorerType => state.explorer

export const getToolData = (state: Object): ToolsType => state.tools
