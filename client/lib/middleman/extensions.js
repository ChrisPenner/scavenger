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

export const setStateComplete = (extensions: ExtensionMap, config: Config, state: Object) => (response: Object) => {
  const stateExtensions = getExtensionType('setStateComplete', extensions)
  const computeStates = R.mapObjIndexed((extension, name) => ({
    [name]: extension({config, response, state: state[name]}),
  }))
  return R.compose(
    R.mergeAll,
    R.values,
    computeStates
  )(stateExtensions)
}

export const setStatePending = (extensions: ExtensionMap, config: Config, state: Object) => {
  const stateExtensions = getExtensionType('setStatePending', extensions)
  const computeStates = R.mapObjIndexed((extension, name) => ({
    [name]: extension({config, state: state[name]}),
  }))
  return R.compose(
    R.mergeAll,
    R.values,
    computeStates
  )(stateExtensions)
}

const hasMeta = R.path(['meta', 'middleman'])
export const combineExtensionReducers = (extensions: ExtensionMap) => {
  const extensionReducers = R.values(R.mapObjIndexed(({reducer}, name) => {
    return (state={}, action) => {
      if (reducer && hasMeta(action)){
        return R.assoc(name, reducer(state[name], action), state)
      }
      return state
    }
  }, extensions))
  const combiner = (combined, next) => (st, act) => combined(next(st, act), act)
  return extensionReducers.reduce(combiner)
}
