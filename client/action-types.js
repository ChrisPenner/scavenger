import R from 'ramda'

const actionsList = [
  'CHANGE_EXPLORER',
  'CHANGE_TEST_MESSAGE',

  'START_DRAG',
  'STOP_DRAG',
  'DROP_ANSWER',
  'DROP_CLUE',

  'RECEIVE_MESSAGE',
  'SEND_MESSAGE',

]

const actionTypeCreators = {
  del: (type) => `DELETE_${type}`,
  set: (type) => `SET_${type}`,
  load: (type) => `LOAD_${type}`,
  change: (type) => `CHANGE_${type}`,
}
export default R.merge(R.zipObj(actionsList, actionsList), actionTypeCreators)
