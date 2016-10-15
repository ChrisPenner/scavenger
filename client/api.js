/* @flow */
import R from 'ramda'
import { camelizeKeys, decamelizeKeys } from 'humps'

import { GET, PUT, DELETE, configureMiddleware } from './lib/middleman'
import at from './actions/types'
import { Story, Clue, Answer, Group, Message, Code } from './resources'
import type {ResourceT} from './resources'

const fetchAll = (resource: ResourceT) => () => ({
  resource: resource.type,
  route: resource.api.route(),
  method: GET,
  after: R.map(camelizeKeys),
})

const fetchPage = (resource: ResourceT) => () => ({
  resource: resource.type,
  route: resource.api.route(),
  method: GET,
  after: R.map(camelizeKeys),
  extensions: {
    paginate: true,
  }
})


const save = (resource: ResourceT) => (state, uid) => ({
  resource: resource.type,
  route: resource.api.route(uid),
  method: PUT,
  payload: resource.selectors.get(state, uid),
  before: decamelizeKeys,
  after: camelizeKeys,
})

const create = (resource: ResourceT) => (state, payload) => ({
  resource: resource.type,
  route: resource.api.route(payload.uid),
  method: PUT,
  payload,
  before: decamelizeKeys,
  after: camelizeKeys,
})

const del = (resource: ResourceT) => (state, uid) => ({
  resource: resource.type,
  route: resource.api.route(uid),
  method: DELETE,
  context: {
    uid
  },
  after: camelizeKeys,
})

export const middlemanConfig = {
  [at.fetch(Story.type)]: fetchAll(Story),
  [at.fetch(Clue.type)]: fetchAll(Clue),
  [at.fetch(Answer.type)]: fetchAll(Answer),
  [at.fetch(Group.type)]: fetchPage(Group),

  [at.fetch(Message.type)]: fetchPage(Message),
  [at.fetch(Code.type)]: fetchPage(Code),

  [at.save(Story.type)]: save(Story),
  [at.save(Clue.type)]: save(Clue),
  [at.save(Answer.type)]: save(Answer),

  [at.create(Story.type)]: create(Story),
  [at.create(Clue.type)]: create(Clue),
  [at.create(Answer.type)]: create(Answer),

  [at.del(Story.type)]: del(Story),
  [at.del(Clue.type)]: del(Clue),
  [at.del(Answer.type)]: del(Answer),
}
export default configureMiddleware(middlemanConfig)
