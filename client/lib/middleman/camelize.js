/* @flow */
import R from 'ramda'
import {camelizeKeys, decamelizeKeys} from 'humps'
import type { Config } from './'
import type { Extension } from './extensions'

const dataLens = R.lensProp('data')
const payloadLens = R.lensProp('payload')
const transformAction = ({config}) => {
  const mode = config.extensions && config.extensions.camelize
  if(!mode){
    return config
  }
  return R.over(payloadLens, decamelizeKeys, config)
}

const transformResponse = ({config, response}) => {
  const mode = config.extensions && config.extensions.camelize
  if(mode === 'map'){
    return R.over(dataLens, R.map(camelizeKeys), response)
  } else if (mode != undefined){
    return R.over(dataLens, camelizeKeys, response)
  }
  return response
}

const camelizer: Extension = {
  transformAction,
  transformResponse,
}

export default camelizer
