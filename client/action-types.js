import R from 'ramda'

const actionsList = [
  'CHANGE_STORY',
  'CHANGE_CLUE',
  'CHANGE_ANSWER',
  'CHANGE_EXPLORER',
  'CHANGE_TEST_MESSAGE',

  'SET_STORY',
  'SET_CLUE',
  'SET_ANSWER',

  'START_DRAG',
  'STOP_DRAG',
  'DROP_ANSWER',

  'DELETE_STORY',
  'DELETE_CLUE',
  'DELETE_ANSWER',

  'LOAD_STORY',
  'LOAD_CLUE',
  'LOAD_ANSWER',

  'RECEIVE_MESSAGE',
  'SEND_MESSAGE',

]
export default R.zipObj(actionsList, actionsList)
