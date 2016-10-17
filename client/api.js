/* @flow */
import { GET, PUT, DELETE, configureMiddleware } from './lib/middleman'
import pagination from './lib/middleman/pagination'
import pending from './lib/middleman/pending'
import camelize from './lib/middleman/camelize'
import at from './actions/types'
import { Story, Clue, Answer, Group, Message, Code } from './resources'
import type {ResourceT} from './resources'
import type { ExtensionMap } from './lib/middleman/extensions'

const extensions: ExtensionMap = {
  pagination,
  pending,
  camelize,
}

const fetchAll = (resource: ResourceT) => () => ({
  resource: resource.type,
  route: resource.api.route(),
  method: GET,
  extensions: {
    paginate: false,
    camelize: 'map',
  },
})

// const fetchPage = (resource: ResourceT) => () => ({
//   resource: resource.type,
//   route: resource.api.route(),
//   method: GET,
//   extensions: {
//     paginate: 10,
//     camelize: true,
//   },
// })


const save = (resource: ResourceT) => (state, uid) => ({
  resource: resource.type,
  route: resource.api.route(uid),
  method: PUT,
  payload: resource.selectors.get(state, uid),
  extensions: {
    camelize: true,
  },
})

const create = (resource: ResourceT) => (state, payload) => ({
  resource: resource.type,
  route: resource.api.route(payload.uid),
  method: PUT,
  payload,
  extensions: {
    camelize: true,
  },
})

const del = (resource: ResourceT) => (state, uid) => ({
  resource: resource.type,
  route: resource.api.route(uid),
  method: DELETE,
  context: {
    uid
  },
  extensions: {
    camelize: true,
  },
})

export const middlemanConfig = {
  [at.fetch(Story.type)]: fetchAll(Story),
  [at.fetch(Clue.type)]: fetchAll(Clue),
  [at.fetch(Answer.type)]: fetchAll(Answer),

  [at.fetch(Group.type)]: fetchAll(Group),
  [at.fetch(Message.type)]: fetchAll(Message),
  [at.fetch(Code.type)]: fetchAll(Code),

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

export const {
  middleware,
  reducer,
} = configureMiddleware(middlemanConfig, extensions)
