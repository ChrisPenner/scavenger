/* @flow */
import R from 'ramda'
import { camelizeKeys, decamelizeKeys } from 'humps'
import { IS_PENDING, NOT_PENDING, GET, INDEX, DELETE, PUT, API_ERROR } from './constants'
import type Config from './'

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

export default (actions: Config, makeRequest:Function = apiRequest) => ({getState, dispatch}: {getState: Function, dispatch: Function}) => (next: Function) => (action: Object) => {
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

  return makeRequest(route, method, payload)
    .then(camelizer).then(
      data => next({
        type: action.type,
        payload: {
          ...data,
          ...context,
        },
        meta: {
          middleman: {
            resource,
            status: IS_PENDING,
          },
        },
      }),
      error => {
        dispatch({
          type: API_ERROR,
          error,
          meta: {
            middleman: {
              resource,
              status: NOT_PENDING,
            }
          }
        })
        throw(error)
      }
    )
}
