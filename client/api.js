/* @flow */
import { INDEX, PUT, DELETE, configureMiddleware } from './lib/middleman'
import at from './action-types'
import { getStory, getClue, getAnswer } from './reducers'
import { Story, Clue, Answer, Group, Message, Code } from './resources'

export const middlemanConfig = {
  [at.fetch(Story.type)]: () => ({
    resource: Story.type,
    route: Story.api.route(),
    method: INDEX,
  }),

  [at.fetch(Clue.type)]: () => ({
    resource: Clue.type,
    route: Clue.api.route(),
    method: INDEX,
  }),

  [at.fetch(Answer.type)]: () => ({
    resource: Answer.type,
    route: Answer.api.route(),
    method: INDEX,
  }),

  [at.fetch(Group.type)]: () => ({
    resource: Group.type,
    route: Group.api.route(),
    method: INDEX,
  }),

  [at.fetch(Message.type)]: () => ({
    resource: Message.type,
    route: Message.api.route(),
    method: INDEX,
  }),

  [at.fetch(Code.type)]: () => ({
    resource: Code.type,
    route: Code.api.route(),
    method: INDEX,
  }),

  [at.save(Story.type)]: (state, uid) => ({
    resource: Story.type,
    route: Story.api.route(uid),
    method: PUT,
    payload: getStory(state, uid),
  }),

  [at.save(Clue.type)]: (state, uid) => ({
    resource: Clue.type,
    route: Clue.api.route(uid),
    method: PUT,
    payload: getClue(state, uid),
  }),

  [at.save(Answer.type)]: (state, uid) => ({
    resource: Answer.type,
    route: Answer.api.route(uid),
    method: PUT,
    payload: getAnswer(state, uid),
  }),

  [at.create(Story.type)]: (state, payload) => ({
    resource: Story.type,
    route: Story.api.route(payload.uid),
    method: PUT,
    payload,
  }),

  [at.create(Clue.type)]: (state, payload) => ({
    resource: Clue.type,
    route: Clue.api.route(payload.uid),
    method: PUT,
    payload,
  }),

  [at.create(Answer.type)]: (state, payload) => ({
    resource: Answer.type,
    route: Answer.api.route(payload.uid),
    method: PUT,
    payload,
  }),

  [at.del(Story.type)]: (state, uid) => ({
    resource: Story.type,
    route: Story.api.route(uid),
    method: DELETE,
    context: {
      uid
    }
  }),

  [at.del(Clue.type)]: (state, uid) => ({
    resource: Clue.type,
    route: Clue.api.route(uid),
    method: DELETE,
    context: {
      uid
    }
  }),

  [at.del(Answer.type)]: (state, uid) => ({
    resource: Answer.type,
    route: Answer.api.route(uid),
    method: DELETE,
    context: {
      uid
    }
  }),
}

export default configureMiddleware(middlemanConfig)
