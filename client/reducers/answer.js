import * as at from 'action-types'

export default (answers = {}, action) => {
  switch (action.type) {
    case at.LOAD_ANSWERS:
      return action.payload
    case at.CHANGE_ANSWER:
      return R.assocPath(action.path, action.value, answers)
    case at.SET_ANSWER:
      return R.assoc(action.payload.uid, action.payload, answers)
    default:
      return answers
  }
}

