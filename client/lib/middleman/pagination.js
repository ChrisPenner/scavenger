/* @flow */
import R from 'ramda'
import type { Extension } from './extensions'

const transformAction = ({config, extensionData={}}) => {
  const mode = config.extensions && config.extensions.paginate
  if(mode){
    const cursor = R.path([config.identifier, 'cursor'], extensionData)
    return {
      ...config,
      params: {
        ...(config.params || {}),
        cursor,
        limit: mode,
        paged: true,
      },
    }
  } else if (mode != undefined){
    return {
      ...config,
      params: {
        ...(config.params || {}),
        paged: false,
      }
    }
  }
  return config
}

const reducer = (state: Object={}, action: Object) => {
  const {status, config:{identifier}, meta} = R.path(['meta', 'middleman'], action)
  if (status === 'complete') {
    const identifierLens = R.lensProp(identifier)
    return R.over(identifierLens, R.assoc('cursor', meta.cursor), state)
  }
  return state
}

const extensionFunctions: Extension = {
  reducer,
  transformAction,
}

// export const hasMore = (state:Object, resource:ResourceT) => {
//   return !state.api.pagination[resource.type].cursor
// }

export default extensionFunctions
