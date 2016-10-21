/* @flow */
import configureMiddleman, { GET, PUT, DELETE } from '../lib/middleman'
import pagination from '../lib/middleman/pagination'
import pending from '../lib/middleman/pending'
import camelize from '../lib/middleman/camelize'
import at from '../actions/types'
import { Story, Clue, Answer, Group, Message, Code } from '../resources'
import type {ResourceT} from '../resources'
import type { ExtensionMap } from '../lib/middleman/extensions'

const extensions: ExtensionMap = {
  pagination,
  pending,
  camelize,
}

const fetchAll = (resource: ResourceT, identifier: string) => () => ({
  identifier,
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


const create = (resource: ResourceT, identifier: string) => (state, payload) => ({
  identifier,
  route: resource.api.route(payload.uid),
  method: PUT,
  payload,
  extensions: {
    camelize: true,
  },
})

// const del = (resource: ResourceT, identifier: string) => (state, uid) => ({
//   identifier,
//   route: resource.api.route(uid),
//   method: DELETE,
//   context: {
//     uid
//   },
//   extensions: {
//     camelize: true,
//   },
// })

export const middlemanConfig = {
  [at.fetch(Story.type)]: fetchAll(Story, Story.type),
  [at.fetch(Clue.type)]: fetchAll(Clue, Clue.type),
  [at.fetch(Answer.type)]: fetchAll(Answer, Answer.type),

  [at.fetch(Group.type)]: fetchAll(Group, Group.type),
  [at.fetch(Message.type)]: fetchAll(Message, Message.type),
  [at.fetch(Code.type)]: fetchAll(Code, Code.type),

  [at.create(Story.type)]: create(Story, at.create(Story.type)),
  [at.create(Clue.type)]: create(Clue, at.create(Clue.type)),
  [at.create(Answer.type)]: create(Answer, at.create(Answer.type)),

  // [at.del(Story.type)]: del(Story, at.del(Story.type)),
  // [at.del(Clue.type)]: del(Clue, at.del(Clue.type)),
  // [at.del(Answer.type)]: del(Answer, at.del(Answer.type)),

  [at.FETCH_MESSAGES_BY_GROUP]: (state, groupUid) => ({
    identifier: `${at.FETCH_MESSAGES_BY_GROUP}/${groupUid}`,
    type: at.fetch(Message.type),
    route: Message.api.route(),
    method: GET,
    extensions: {
      paginate: 20,
      camelize: 'map',
    },
    params: {
      groupUid,
      sortBy: '-sent',
    },
  }),

  [at.FETCH_MESSAGES_BY_STORY]: (state, storyUid) => ({
    identifier: `${at.FETCH_MESSAGES_BY_STORY}/${storyUid}`,
    resource: Message.type,
    type: at.fetch(Message.type),
    route: Message.api.route(),
    method: GET,
    extensions: {
      paginate: 20,
      camelize: 'map',
    },
    params: {
      storyUid: storyUid,
      sortBy: '-sent',
    },
  }),
}

export const {
  middleware,
  reducer,
} = configureMiddleman(middlemanConfig, extensions)
