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

const createResource = ({route, factory}) => {
  return class Resource {
    static index() {
      return R.compose(processResponse, fetch, route)(INDEX)
        .then(R.map(camelizeKeys))
    }

    static get(uid) {
      return R.compose(processResponse, fetch, route)(uid)
        .then(camelizeKeys)
    }

    static put(uid, payload) {
      return processResponse(fetch(route(uid), {
        method: 'put',
        body: JSON.stringify(decamelizeKeys(payload)),
      })).then(camelizeKeys)
    }

    static post(uid, payload) {
      return fetch(route(uid), {
        method: 'post',
        body: JSON.stringify(decamelizeKeys(payload)),
      }).then(resp => resp.json())
        .then(camelizeKeys)
    }

    static new(args) {
      return factory(args)
    }
  }
}

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

export const Story = createResource({
  route: Routes.story,
  factory: storyFactory
})
export const Clue = createResource({
  route: Routes.clue,
  factory: clueFactory
})
export const Answer = createResource({
  route: Routes.answer,
  factory: answerFactory
})
