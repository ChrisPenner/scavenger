/* @flow */
import R from 'ramda'
import { IS_PENDING, NOT_PENDING, GET, API_ERROR } from './constants'
import appendQuery from 'append-query'
import { paginationTransformAction, paginationGetState } from './pagination'
import type {ConfigMap} from './'

const dataLens = R.lensProp('data')

const transformResponseExtensions = {
}

const transformActionExtensions = {
  pagination: paginationTransformAction,
}

const getStateExtensions = {
  pagination: paginationGetState,
}


const transformAction = (extensions, options, extensionState={}) => {
  const configuredExtensions = R.mapObjIndexed((extension, name) => extension(R.prop(name, extensionState)), extensions)
  return R.compose(
    R.identity,
    ...R.values(configuredExtensions
    ))(options)
}

const transformResponse = (extensions) => (response) => {
  return R.compose(
    R.identity,
    ...R.values(extensions)
  )(response)
}

const getExtensionState = (extensions) => (options) => (response) => {
  const computeStates = R.mapObjIndexed((extension, name) => ({
    [name]: extension(options, response),
  }))
  return R.compose(
    R.mergeAll,
    R.values,
    computeStates
  )(extensions)
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

export default (actions: ConfigMap, makeRequest:Function = apiRequest) => ({getState}: {getState: Function, dispatch: Function}) => (next: Function) => (action: Object) => {
  if(! R.has(action.type, actions)){
    return next(action)
  }
  const state = getState()
  const options = actions[action.type](state, action.payload)
  const {
    route,
    params={},
    payload,
    resource,
    method=GET,
    context={},
    before=R.identity,
    after=R.identity,
  } = transformAction(transformActionExtensions, options, state.api.extensions)

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
    .then(transformResponse(transformResponseExtensions))
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
          extensions: getExtensionState(getStateExtensions)(options)({data, ...meta}),
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
