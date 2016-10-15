/* @flow */
import R from 'ramda'

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

export const paginationGetState = (options, { cursor }) => ({
  [options.resource]: {
    cursor
  }
})
