/* @flow */
import R from 'ramda'

const fakeDispatch = (results: Array<Object>, returnValue: any) => (action: Object) => {
  results.push(action)
  return returnValue
}

export const applyThunk = R.curry((reducer: Function, initialState: any, globalState: any, thunk: Function) => {
  const actions = []
  thunk(fakeDispatch(actions, Promise.resolve("set dispatch return")), () => globalState)
  return R.reduce(reducer, initialState, actions)
})

export const thunkCollectActions = (dispatchReturn: any, globalState: any, thunk: Function) => {
  const actions = []
  thunk(fakeDispatch(actions, dispatchReturn))
  return actions
}
