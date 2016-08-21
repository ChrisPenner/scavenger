/* @flow */
export default (transformer: Function, reducer: Function) => (state: Object, action: Object) => {
  const newState = reducer(state, action)
  if (newState === state) {
    return state
  }
  return transformer(newState)
}
