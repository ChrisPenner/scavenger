export const load = (resourceType) => `LOAD_${resourceType.toUpperCase()}`
export const change = (resourceType) => `CHANGE_${resourceType.toUpperCase()}`
export const set = (resourceType) => `SET_${resourceType.toUpperCase()}`
export const del = (resourceType) => `DELETE_${resourceType.toUpperCase()}`

export const CHANGE_EXPLORER = 'CHANGE_EXPLORER'
export const SEND_MESSAGE = 'SEND_MESSAGE'
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'
