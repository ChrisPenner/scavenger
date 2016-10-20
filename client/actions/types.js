/* @flow */
export default {
  del: (type:string) => `DELETE_${type}`,
  save: (type:string) => `SAVE_${type}`,
  fetch: (type:string) => `FETCH_${type}`,
  change: (type:string) => `CHANGE_${type}`,
  create: (type:string) => `CREATE_${type}`,

  CHANGE_EXPLORER: 'CHANGE_EXPLORER',
  CHANGE_TEST_MESSAGE: 'CHANGE_TEST_MESSAGE',

  START_DRAG_CLUE: 'START_DRAG_CLUE',
  START_DRAG_ANSWER: 'START_DRAG_ANSWER',

  DROP_ANSWER: 'DROP_ANSWER',
  DROP_CLUE: 'DROP_CLUE',

  REORDER_ANSWER: 'REORDER_ANSWER',
  REORDER_CLUE: 'REORDER_CLUE',

  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
  SEND_MESSAGE: 'SEND_MESSAGE',

  FETCH_MESSAGES_BY_GROUP: 'FETCH_MESSAGES_BY_GROUP',
  FETCH_MESSAGES_BY_STORY: 'FETCH_MESSAGES_BY_STORY',
}
