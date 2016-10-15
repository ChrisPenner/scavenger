/* @flow */
import R from 'ramda'
import { IS_PENDING, NOT_PENDING, GET, API_ERROR } from './constants'
import appendQuery from 'append-query'
import { transformAction, getExtensionState, transformResponse } from './extensions'
import type {ConfigMap, Config} from './'
import type { ExtensionMap } from './extensions'

const dataLens = R.lensProp('data')

const apiRequest = ({route, method=GET, payload=undefined}: makeRequestType) => {
  const options: Object = {
    method,
    credentials: 'same-origin',
    body: payload && JSON.stringify(payload),
  }
  return processResponse(fetch(route, options))
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

export default (actions: ConfigMap, extensions: ExtensionMap={}, makeRequest:Function = apiRequest) => ({getState}: {getState: Function, dispatch: Function}) => (next: Function) => (action: Object) => {
  if(! R.has(action.type, actions)){
    return next(action)
  }
  const state = getState()
  const config: Config = actions[action.type](state, action.payload)
  const {
    route,
    params={},
    payload,
    resource,
    method=GET,
    context={},
    before=R.identity,
    after=R.identity,
  } = transformAction(extensions, config, state.api.extensions)

  next({
    type: `PENDING_${action.type}`,
    meta: {
      middleman: {
        status: IS_PENDING,
        resource,
      },
    },
  })

  const routeWithParams = appendQuery(route, params)

  return makeRequest({route: routeWithParams, method, payload: before(payload)})
    .then(R.over(dataLens, after))
    .then(transformResponse(extensions, config))
    .then(({data, ...meta}) => next({
      type: action.type,
      payload: {
        ...data,
        ...context,
      },
      meta: {
        middleman: {
          resource,
          status: NOT_PENDING,
          extensions: getExtensionState(extensions)(config)({data, ...meta}),
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
