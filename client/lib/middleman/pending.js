/* @flow */
import R from 'ramda'
import type { Extension } from './extensions'

const reducer = (state: Object={}, action: Object) => {
  const {status, resource} = R.path(['meta', 'middleman'], action)
  const resourceLens = R.lensProp(resource)
  if (status === 'complete') {
    const changeStatus = R.compose(
      R.assoc('pending', false),
      R.assoc('initialized', true)
    )
    return R.over(resourceLens, changeStatus, state)
  } else if (status === 'pending'){
    return R.over(resourceLens, R.assoc('pending', true), state)
  }
  return state
}

const extensionFunctions: Extension = {
  reducer,
}

export default extensionFunctions

