/* @flow */
import R from 'ramda'

export const loadedReducer = (state:Object={}, {type, payload}:Object) => {
  if (type.startsWith('LOAD')) {
    return R.assoc(type, true, state)
  }
  return state
}

export const loadedAction = (path:string) => ({
  type: 'LOADED',
  payload: path,
})
