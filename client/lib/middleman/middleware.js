/* @flow */
import R from 'ramda'
import { camelizeKeys, decamelizeKeys } from 'humps'
import { IS_PENDING, NOT_PENDING, GET, INDEX, API_ERROR } from './constants'
import appendQuery from 'append-query'
import type {Config} from './'

const addQueryParams = (route, resourceMeta) => {
  debugger
  const { cursor } = resourceMeta
  return appendQuery(route, {cursor}, { encodeComponents: false })
}

const processResponse = (respPromise) => {
  return respPromise.then(resp => {
    return resp.json().catch(() => {
      throw resp.statusText
    })
  }).then(json => {
    if (json.error) {
      throw json.error
    }
    return json
  })
}

type makeRequestType = {
  route: string,
  method: string,
  payload?:any,
}

const apiRequest = ({route, method=GET, payload=undefined}: makeRequestType) => {
  const options: Object = {
    method,
    credentials: 'same-origin',
  }
  if (payload !== undefined) {
    options.body = JSON.stringify(decamelizeKeys(payload))
  }
  return processResponse(fetch(route, options))
}

export default (actions: Config, makeRequest:Function = apiRequest) => ({getState}: {getState: Function, dispatch: Function}) => (next: Function) => (action: Object) => {
  if(! R.has(action.type, actions)){
    return next(action)
  }
  const state = getState()
  let {route, method, payload, resource, context} = actions[action.type](state, action.payload)
  const mapKeys = method === INDEX
  const camelizer = ({data={}, ...meta}) => {
    let newData
    if(mapKeys) {
      newData = R.map(camelizeKeys, data)
    } else {
      newData = camelizeKeys(data)
    }
    return {
      data: newData,
      ...camelizeKeys(meta),
    }
  }
  // Change method to GET if it's index
  method = method === INDEX ? GET : method

  next({
    type: `PENDING_${action.type}`,
    meta: {
      middleman: {
        status: IS_PENDING,
        resource,
      },
    },
  })
  const resourceMeta = state.api[resource] || {}
  const routeWithParams = addQueryParams(route, resourceMeta)
  return makeRequest({route: routeWithParams, method, payload})
    .then(camelizer).then(
      ({data, ...meta}) => next({
        type: action.type,
        payload: {
          ...data,
          ...context,
        },
        meta: {
          middleman: {
            resource,
            status: NOT_PENDING,
            ...meta,
          },
        },
      }),
      error => {
        next({
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
