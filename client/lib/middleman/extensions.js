/* @flow */
import R from 'ramda'
import type { Config } from './'

export type Extension = {
  getState?: (args: {
    config: Config,
    response: Object,
  }) => Object,

  transformAction?: (args: {
    config: Config, 
    extensionData: Object,
  }) => Object,

  transformResponse?: (args: {
    config: Config,
    response: Object,
  }) => Object
}

export type ExtensionMap = {[key: string]: Extension}

const getExtensionType = (type, extensions) => R.compose(
  R.filter(R.identity),
  R.map(R.prop(type))
)(extensions)

export const transformAction = (extensions: ExtensionMap, config: Config, extensionState: Object={}) => {
  const actionExtensions = getExtensionType('transformAction', extensions)
  const configuredExtensions = R.mapObjIndexed((extension, name) => (config) => extension({config, extensionData: R.prop(name, extensionState)}), actionExtensions)
  return R.compose(
    R.identity,
    ...R.values(configuredExtensions)
  )(config)
}

export const transformResponse = (extensions: ExtensionMap, config: Config) => (response: Object) => {
  const responseExtensions = R.values(getExtensionType('transformResponse', extensions))
  const pipeResponse = (response, extension) => extension({config, response})
  return R.reduce(pipeResponse, response, responseExtensions)
}

export const getExtensionState = (extensions: ExtensionMap) => (config: Config) => (response: Object) => {
  const stateExtensions = getExtensionType('getState', extensions)
  const computeStates = R.mapObjIndexed((extension, name) => ({
    [name]: extension({config, response}),
  }))
  return R.compose(
    R.mergeAll,
    R.values,
    computeStates
  )(stateExtensions)
}

