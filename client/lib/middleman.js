/* @flow */
import toastr from 'toastr'
import R from 'ramda'
import { camelizeKeys, decamelizeKeys } from 'humps'

export const API = '@middleman/API'
export const API_ERROR = '@middleman/API_ERROR'

export const INDEX = 'INDEX'
export const GET = 'GET'
export const DELETE = 'DELETE'
export const PUT = 'PUT'

// export const apiCall = ({type, route, method, payload}) => ({
//   type,
//   [API]:
// })

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

const apiRequest = (route, method: MethodType='GET', payload=undefined) => {
  const options: Object = {
    method,
    credentials: 'same-origin',
  }
  if (payload !== undefined) {
    options.body = JSON.stringify(decamelizeKeys(payload))
  }
  return processResponse(fetch(route, options))
}


const middleman = (makeRequest) => (store: Object) => (next: Function) => (action: Object) => {
  if(!R.has(API, action)){
    return next(action)
  }
  let {route, method, payload:dataPayload, context} = action[API]
  let camelizer = camelizeKeys
  if (method === INDEX) {
    method = GET
    camelizer = R.map(camelizeKeys)
  }
  return makeRequest(route, method, dataPayload)
    .then(camelizer).then(
      data => next({
        type: action.type,
        payload: {
          ...data,
          ...context,
        },
      }),
      error => {
        next({
          type: API_ERROR,
          error,
        })
        throw(error)
      }
    )
}

export const testMiddleman = (returnData:any) => middleman(()=>Promise.resolve(returnData))
export default middleman(apiRequest)
