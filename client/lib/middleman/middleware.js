/* @flow */
import R from 'ramda'
import { IS_PENDING, NOT_PENDING, GET, API_ERROR } from './constants'
import appendQuery from 'append-query'
import type {Config} from './'

const dataLens = R.lensProp('data')

const addQueryParams = (route, resourceMeta) => {
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
    body: payload && JSON.stringify(payload),
  }
  return processResponse(fetch(route, options))
}

export default (actions: Config, makeRequest:Function = apiRequest) => ({getState}: {getState: Function, dispatch: Function}) => (next: Function) => (action: Object) => {
  if(! R.has(action.type, actions)){
    return next(action)
  }
  const state = getState()
  const {
    route,
    payload,
    resource,
    method=GET,
    context={},
    before=R.identity,
    after=R.identity,
  } = actions[action.type](state, action.payload)

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

  return makeRequest({route: routeWithParams, method, payload: before(payload)})
    .then(R.over(dataLens, after)).then(
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
