/* @flow */
import R from 'ramda'
import type { Config } from './'

export const paginationTransformAction = (extensionData: Object={} ) => (options: Object) => {
  if(options.extensions && options.extensions.paginate){
    const cursor = R.path([options.resource, 'cursor'], extensionData)
    return {
      ...options,
      params: {
        ...(options.params || {}),
        cursor,
      },
    }
  }
  return options
}

export const paginationGetState = (config: Config, { cursor }: Object) => ({
  [config.resource]: {
    cursor
  }
})
