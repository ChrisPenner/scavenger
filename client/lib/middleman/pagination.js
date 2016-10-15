/* @flow */
import R from 'ramda'
import type { Config } from './'
import type { Extension } from './extensions'

const transformAction = (extensionData: Object={}) => (config: Config) => {
  if(config.extensions && config.extensions.paginate){
    const cursor = R.path([config.resource, 'cursor'], extensionData)
    return {
      ...config,
      params: {
        ...(config.params || {}),
        cursor,
      },
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
