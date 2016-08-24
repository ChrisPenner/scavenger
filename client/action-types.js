/* @flow */
export type ActionKind = string

export const load = (resourceType: string): ActionKind => `LOAD_${resourceType.toUpperCase()}`
export const change = (resourceType: string): ActionKind => `CHANGE_${resourceType.toUpperCase()}`
export const set = (resourceType: string): ActionKind => `SET_${resourceType.toUpperCase()}`
export const del = (resourceType: string): ActionKind => `DELETE_${resourceType.toUpperCase()}`

export const SEND_MESSAGE: ActionKind = 'SEND_MESSAGE'
export const RECEIVE_MESSAGE: ActionKind = 'RECEIVE_MESSAGE'

export const CHANGE_TEST_MESSAGE: ActionKind = 'CHANGE_TEST_MESSAGE'

export const REORDER_ANSWER: ActionKind = 'REORDER_ANSWER'
