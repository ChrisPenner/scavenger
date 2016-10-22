/* @flow */
import configureMiddleman, { GET, PUT, DELETE } from './lib/middleman'
import pagination from './lib/middleman/pagination'
import pending from './lib/middleman/pending'
import camelize from './lib/middleman/camelize'
import at from './actions/types'
import { mkIdentifier } from './actions'
import { Story, Clue, Answer, Group, Message, Code } from './resources'
import type {ResourceT} from './resources'
import type { ExtensionMap } from './lib/middleman/extensions'

const extensions: ExtensionMap = {
  pagination,
  pending,
  camelize,
}

const fetchAll = (resource: ResourceT<*>, identifier: string) => () => ({
  identifier,
  route: resource.api.route(),
  method: GET,
  extensions: {
    paginate: false,
    camelize: 'map',
  },
})

const save = (resource: ResourceT<*>, identifier: string) => (state, uid) => ({
  identifier,
  route: resource.api.route(uid),
  method: PUT,
  payload: resource.selectors.get(state, uid),
  extensions: {
    camelize: true,
  },
})

const create = (resource: ResourceT<*>, identifier: string) => (state, payload) => ({
  identifier,
  route: resource.api.route(payload.uid),
  method: PUT,
  payload,
  extensions: {
    camelize: true,
  },
})

const del = (resource: ResourceT<*>, identifier: string) => (state, uid) => ({
  identifier,
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
  [Story.types.fetch]: fetchAll(Story, Story.type),
  [Clue.types.fetch]: fetchAll(Clue, Clue.type),
  [Answer.types.fetch]: fetchAll(Answer, Answer.type),

  [Group.types.fetch]: fetchAll(Group, Group.type),
  [Message.types.fetch]: fetchAll(Message, Message.type),
  [Code.types.fetch]: fetchAll(Code, Code.type),

  [Story.types.save]: save(Story, Story.types.save),
  [Clue.types.save]: save(Clue, Clue.types.save),
  [Answer.types.save]: save(Answer, Answer.types.save),

  [Story.types.create]: create(Story, Story.types.create),
  [Clue.types.create]: create(Clue, Clue.types.create),
  [Answer.types.create]: create(Answer, Answer.types.create),

  [Story.types.del]: del(Story, Story.types.del),
  [Clue.types.del]: del(Clue, Clue.types.del),
  [Answer.types.del]: del(Answer, Answer.types.del),

  [at.FETCH_MESSAGES_BY_GROUP]: (state, groupUid) => ({
    identifier: mkIdentifier(at.FETCH_MESSAGES_BY_GROUP, groupUid),
    type: Message.types.fetch,
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
    identifier: mkIdentifier(at.FETCH_MESSAGES_BY_STORY, storyUid),
    resource: Message.type,
    type: Message.types.fetch,
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

export type APIState = {
  explorer: Object,
  pending: Object,
}

export const {
  middleware,
  reducer,
} = configureMiddleman(middlemanConfig, extensions)
