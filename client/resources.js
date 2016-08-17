import toastr from 'toastr'
import { camelizeKeys, decamelizeKeys } from 'humps'
import Routes, { INDEX } from 'api'

const handleError = err => {
  toastr.error(err, 'Error');
  throw err
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
    return json.data
  }).catch(handleError)
}

const apiRequest = (route, method='get', payload=undefined) => {
  const options = {
    method,
  }
  if (payload !== undefined) {
    options.body = JSON.stringify(decamelizeKeys(payload))
  }
  let transform = camelizeKeys
  return processResponse(fetch(route, options))
}

export const index = (resource) => apiRequest(resource.route(INDEX)).then(R.map(camelizeKeys))
export const get = (resource, uid) => apiRequest(resource.route(uid)).then(camelizeKeys)
export const put = (resource, uid, payload) => apiRequest(resource.route(uid), 'put', payload).then(camelizeKeys)
export const post = (resource, uid, payload) => apiRequest(resource.route(uid), 'post', payload).then(camelizeKeys)

const storyFactory = (args) => ({
  uid: null,
  defaultHint: '',
  clues: [],
  ...args,
})

const clueFactory = (args) => ({
  uid: null,
  storyUid: null,
  text: '',
  hint: '',
  mediaUrl: '',
  answerUids: [],
  ...args,
})

const answerFactory = (args) => ({
  uid: null,
  storyUid: null,
  clueUid: null,
  pattern: '',
  nextClue: '',
  ...args,
})

export const Story = {
  route: Routes.story,
  new: storyFactory,
  type: 'STORY',
}

export const Clue = {
  route: Routes.clue,
  new: clueFactory,
  type: 'CLUE',
}

export const Answer = {
  route: Routes.answer,
  new: answerFactory,
  type: 'ANSWER',
}
