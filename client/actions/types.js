/* @flow */
import R from 'ramda'
import type { ResourceType } from '../resources'

const actionTypeCreators: {[name: string]: (type:ResourceType) => string} = {
  del: (type) => `DELETE_${type}`,
  save: (type) => `SAVE_${type}`,
  fetch: (type) => `FETCH_${type}`,
  change: (type) => `CHANGE_${type}`,
  create: (type) => `CREATE_${type}`,
}

const actionsList = [
  'CHANGE_EXPLORER',
  'CHANGE_TEST_MESSAGE',

  'START_DRAG',
  'STOP_DRAG',
  'DROP_ANSWER',
  'DROP_CLUE',

  'RECEIVE_MESSAGE',
  'SEND_MESSAGE',

  'FETCH_MESSAGES_BY_GROUP',
  'FETCH_MESSAGES_BY_STORY',
]

type ActionType = any

const actionTypes: {[keyName: string]: ActionType} = R.merge(R.zipObj(actionsList, actionsList), actionTypeCreators)
export default actionTypes
