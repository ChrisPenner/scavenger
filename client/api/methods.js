/* @flow */
import { GET, PUT, DELETE } from '../lib/middleman'
import type {ResourceT} from '../resources'

type apiOptions = {
  route: string,
  method: string,
  payload?: any,
}

const apiRequest = ({route, method=GET, payload}: apiOptions) => {
  const options: Object = {
    method,
    credentials: 'same-origin',
    body: payload && JSON.stringify(payload),
  }
  return fetch(route, options)
    .then((resp) => resp.json())
}

export const save = (resource: ResourceT) => (data: Object) => {
  return apiRequest({
    route: resource.api.route(data.uid),
    method: PUT,
    payload: data,
  })
}

export const del = (resource: ResourceT) => (uid: string) => {
  return apiRequest({
    route: resource.api.route(uid),
    method: DELETE,
  })
}
