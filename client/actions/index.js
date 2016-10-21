/* @flow */
import R from 'ramda'
import { successToast, errorToast } from '../lib/wisp'
import { push } from 'react-router-redux'
import { createAction } from 'redux-actions'

import at from '../actions/types'
const { saga } = at
import { Story, Code, Clue, Answer, Group, Message } from '../resources'
import type { ResourceT } from '../resources'

export type FSA = {
  type: string,
  payload?: any,
  error?: any,
  meta?: any,
}

const changer = (path: Array<string>, value: any) => ({path, value})

const creator = (resource: ResourceT) => (payload: any) => (dispatch: Function) => {
  return dispatch({
    type: at.create(resource.type),
    payload,
  }).then(() => dispatch(push(resource.route(payload.uid))))
    .then(R.tap(() => dispatch(successToast('Created'))))
    .catch(() => dispatch(errorToast('Failed to Create')))
}

export const genericAction = R.curry((type, payload) => ({type, payload}))

export const changeTestMessage = createAction(at.CHANGE_TEST_MESSAGE)


export const startDragClue = createAction(at.START_DRAG_CLUE)
export const startDragAnswer = createAction(at.START_DRAG_ANSWER)

export const dropClue = createAction(at.DROP_CLUE)
export const dropAnswer = createAction(at.DROP_ANSWER)

export const reorderClue = createAction(at.REORDER_CLUE)
export const reorderAnswer = createAction(at.REORDER_ANSWER)

export const changeStory = createAction(at.change(Story.type), changer)
export const changeClue = createAction(at.change(Clue.type), changer)
export const changeAnswer = createAction(at.change(Answer.type), changer)
export const changeExplorer = createAction(at.CHANGE_EXPLORER, changer)

export const fetchStory = createAction(at.fetch(Story.type))
export const fetchClue = createAction(at.fetch(Clue.type))
export const fetchAnswer = createAction(at.fetch(Answer.type))
export const fetchGroup = createAction(at.fetch(Group.type))
export const fetchMessage = createAction(at.fetch(Message.type))
export const fetchCode = createAction(at.fetch(Code.type))

export const fetchGroupMessage = createAction(at.FETCH_MESSAGES_BY_GROUP)
export const fetchStoryMessage = createAction(at.FETCH_MESSAGES_BY_STORY)

export const deleteStory = Story.actions.saga.del
export const deleteClue = Clue.actions.saga.del
export const deleteAnswer = Answer.actions.saga.del

export const createStory = creator(Story)
export const createClue = creator(Clue)
export const createAnswer = creator(Answer)

export const saveStory = createAction(saga(at.save(Story.type)))
export const saveClue = createAction(saga(at.save(Clue.type)))
export const saveAnswer = createAction(saga(at.save(Answer.type)))

export const sendMessage = createAction(saga(at.SEND_MESSAGE))
export const receiveMessage = createAction(at.RECEIVE_MESSAGE, R.assoc('source', 'server'))
