/* @flow */
import R from 'ramda'
import {camelizeKeys, decamelizeKeys} from 'humps'
import type { Config } from './'
import type { Extension } from './extensions'

const dataLens = R.lensProp('data')
const payloadLens = R.lensProp('payload')
const transformAction = () => (config: Config) => {
  const mode = config.extensions && config.extensions.camelize
  if(! mode){
    return config
  }
  return R.over(payloadLens, decamelizeKeys, config)
}

const transformResponse = (response: Object, extensionConfig: any) => {
  if(extensionConfig === 'map'){
    return R.over(dataLens, R.map(camelizeKeys), response)
  } 
  return R.over(dataLens, camelizeKeys, response)
}

const camelizer: Extension = {
  transformAction,
  transformResponse,
}

export default camelizer
