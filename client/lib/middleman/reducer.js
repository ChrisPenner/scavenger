/* @flow */
import R from 'ramda'

const DEFAULT_STATE = {
}
export default (state: Object = DEFAULT_STATE, action: Object) => {
  const info: Object = R.path(['meta', 'middleman'], action)
  if(!info){
    return state
  }
  const { state:newState } = info
  return R.mergeWith(R.merge, state, newState)
}
