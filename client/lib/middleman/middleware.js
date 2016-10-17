/* @flow */
import R from 'ramda'
import { GET, API_ERROR } from './constants'
import appendQuery from 'append-query'
import { transformAction, transformResponse, combineExtensionReducers } from './extensions'
import type {ConfigMap, Config} from './'
import type { ExtensionMap } from './extensions'

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

export default ( actions: ConfigMap, extensions: ExtensionMap={}, makeRequest:Function = apiRequest) =>
{
  const reducer = combineExtensionReducers(extensions)
  const middleware = ({getState}: {getState: Function, dispatch: Function}) =>
    (next: Function) =>
    (action: Object) => {
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
      } = transformAction(extensions, config, state.api.extensions)

      next({
        type: `PENDING_${action.type}`,
        meta: {
          middleman: {
            resource,
            status: 'pending',
          },
        },
      })

      const routeWithParams = appendQuery(route, params)

      return makeRequest({route: routeWithParams, method, payload})
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
              status: 'complete',
              meta,
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
                  status: 'error',
                }
              }
            })
            throw(error)
          }
        )
    }
  return {
    reducer,
    middleware,
  }
}
