/* @flow */
export const load = (resourceType: string) => `LOAD_${resourceType.toUpperCase()}`
export const change = (resourceType: string) => `CHANGE_${resourceType.toUpperCase()}`
export const set = (resourceType: string) => `SET_${resourceType.toUpperCase()}`
export const del = (resourceType: string) => `DELETE_${resourceType.toUpperCase()}`

export const CHANGE_EXPLORER = 'CHANGE_EXPLORER'
export const SEND_MESSAGE = 'SEND_MESSAGE'
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'
export const REORDER_ANSWER = 'REORDER_ANSWER '

export const START_DRAG = 'START_DRAG'
export const STOP_DRAG = 'STOP_DRAG'
