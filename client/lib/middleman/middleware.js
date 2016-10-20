/* @flow */
import R from 'ramda'
import { GET, API_ERROR } from './constants'
import appendQuery from 'append-query'
import { transformAction, transformResponse } from './extensions'
import type {ConfigMap, Config} from './'
import type { ExtensionMap } from './extensions'

type makeRequestType = {
  route: string,
  method: string,
  payload?:any,
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

const apiRequest = ({route, method=GET, payload}: makeRequestType) => {
  const options: Object = {
    method,
    credentials: 'same-origin',
    body: payload && JSON.stringify(payload),
  }
  return processResponse(fetch(route, options))
}

export default (actions: ConfigMap, extensions: ExtensionMap) =>
  ({getState}: {getState: Function, dispatch: Function}) =>
  (next: Function) =>
  (action: Object) => {
    if(!R.has(action.type, actions)){
      return next(action)
    }
    const state = getState()
    const config: Config = actions[action.type](state, action.payload)
    const {
      type=action.type,
      route,
      params={},
      payload,
      method=GET,
      context={},
    } = transformAction(extensions, config, state.api)

    next({
      type: `PENDING_${type}`,
      meta: {
        middleman: {
          config,
          status: 'pending',
        },
      },
    })

    const routeWithParams = appendQuery(route, params)

    return apiRequest({route: routeWithParams, method, payload})
      .then(transformResponse(extensions, config))
      .then(({data, ...meta}) => next({
        type,
        payload: {
          ...data,
          ...context,
        },
        meta: {
          middleman: {
            config,
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
                config,
                status: 'error',
              }
            }
          })
          throw(error)
        }
      )
  }
