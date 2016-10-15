/* @flow */
import R from 'ramda'
import type { Config } from './'

export type Extension = {
  getState?: (config: Config, response: Object) => Object,
  transformAction?: (config: Config, extensionData: Object) => Object,
  transformResponse?: (config: Config) => (response: Object) => Object
}

export type ExtensionMap = {[key: string]: Extension}

const getExtensionType = (type, extensions) => R.compose(
  R.filter(R.identity),
  R.map(R.prop(type))
)(extensions)

export const transformAction = (extensions: ExtensionMap, config: Config, extensionState: Object={}) => {
  const actionExtensions = getExtensionType('transformAction', extensions)
  const configuredExtensions = R.mapObjIndexed((extension, name) => extension(R.prop(name, extensionState)), actionExtensions)
  return R.compose(
    R.identity,
    ...R.values(configuredExtensions)
  )(config)
}

export const transformResponse = (extensions: ExtensionMap, config: Config) => (response: Object) => {
  const responseExtensions = R.values(getExtensionType('transformResponse', extensions))
  const loadedWithConfig = R.map(extension => extension(config), responseExtensions)
  return R.compose(
    R.identity,
    ...loadedWithConfig
  )(response)
}

export const getExtensionState = (extensions: ExtensionMap) => (config: Config) => (response: Object) => {
  const stateExtensions = getExtensionType('getState', extensions)
  const computeStates = R.mapObjIndexed((extension, name) => ({
    [name]: extension(config, response),
  }))
  return R.compose(
    R.mergeAll,
    R.values,
    computeStates
  )(stateExtensions)
}

