/* @flow */
import R from 'ramda'
import type { Extension } from './extensions'

const transformAction = ({config, extensionData={}}) => {
  const mode = config.extensions && config.extensions.paginate
  if(mode === true){
    const cursor = R.path([config.resource, 'cursor'], extensionData)
    return {
      ...config,
      params: {
        ...(config.params || {}),
        cursor,
      },
    }
  } else if (mode != undefined){
    return {
      ...config,
      params: {
        ...(config.params || {}),
        all: true,
      }
    }
  }
  return config
}

const getState = ({config,  response: { cursor }}) => ({
  [config.resource]: {
    cursor
  }
})

const extensionFunctions: Extension = {
  getState,
  transformAction,
}

export default extensionFunctions
