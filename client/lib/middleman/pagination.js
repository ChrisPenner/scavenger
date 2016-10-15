/* @flow */
import R from 'ramda'
import type { Config } from './'
import type { Extension } from './extensions'

const transformAction = (extensionData: Object={}) => (config: Config) => {
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

const getState = (config: Config, { cursor }: Object) => ({
  [config.resource]: {
    cursor
  }
})

const extensionFunctions: Extension = {
  getState,
  transformAction,
}

export default extensionFunctions
