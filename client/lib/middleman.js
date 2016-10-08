/* @flow */
import R from 'ramda'
import { camelizeKeys, decamelizeKeys } from 'humps'
import { IS_PENDING, NOT_PENDING } from './pending'

export const INDEX = 'INDEX'
export const GET = 'GET'
export const DELETE = 'DELETE'
export const PUT = 'PUT'

const processResponse = (respPromise) => {
  return respPromise.then(resp => {
    return resp.json().catch(() => {
      throw resp.statusText
    })
  }).then(json => {
    if (json.error) {
      throw json.error
    }
    return json.data
  })
}

const apiRequest = (route: string, method: MethodType='GET', payload=undefined) => {
  const options: Object = {
    method,
    credentials: 'same-origin',
  }
  if (payload !== undefined) {
    options.body = JSON.stringify(decamelizeKeys(payload))
  }
  return processResponse(fetch(route, options))
}

type middlemanSpec = {
  route: string,
  method: string,
  context?: Object,
}

type Config = {[key:string]: (state :Object, payload: Object) => Object }
const middleman = (makeRequest: Function) => (actions: Config) => ({getState, dispatch}: {getState: Function, dispatch: Function}) => (next: Function) => (action: Object) => {
  if(! R.has(action.type, actions)){
    return next(action)
  }
  const state = getState()
  let {route, method, payload, resource, context} = actions[action.type](state, action.payload)
  let camelizer = camelizeKeys
  if (method === INDEX) {
    method = GET
    camelizer = R.map(camelizeKeys)
  }

  dispatch({
    type: IS_PENDING,
    payload: resource,
  })

  return makeRequest(route, method, payload)
    .then(camelizer).then(
      data => {
        dispatch({
          type: NOT_PENDING,
          payload: resource,
        })
        return next({
          type: action.type,
          payload: {
            ...data,
            ...context,
          },
        })
      },
      error => {
        dispatch({
          type: NOT_PENDING,
          paylaod: resource,
          error,
        })
        throw(error)
      }
    )
}

export const testMiddleman = (returnData:any) => middleman(()=>Promise.resolve(returnData))
export default middleman(apiRequest)
