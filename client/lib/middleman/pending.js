/* @flow */
import R from 'ramda'
import type { Extension } from './extensions'
import type { ResourceT } from '../../resources'

const reducer = (state: Object={}, action: Object) => {
  const {status, config:{identifier}} = R.path(['meta', 'middleman'], action)
  const resourceLens = R.lensProp(identifier)
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

export const isPending = (state:Object, resource:ResourceT) => {
  return R.path(['api', 'pending', resource.type, 'pending'], state)
}

export default extensionFunctions
