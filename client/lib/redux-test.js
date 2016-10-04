/* @flow */
import R from 'ramda'

const fakeDispatch = (results: Array<Object>) => (action: Object) => results.push(action)

export const applyThunk = R.curry((reducer: Function, initialState: any, globalState: any, thunk: Function) => {
  const actions = []
  thunk(fakeDispatch(actions), () => globalState)
  return R.reduce(reducer, initialState, actions)
})
