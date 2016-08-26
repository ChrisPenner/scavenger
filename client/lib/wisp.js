/* @flow */
import Animate from 'react-addons-css-transition-group'
import { handleActions } from 'redux-actions'
import { connect } from 'react-redux'
import R from 'ramda'
export const CREATE_TOAST = 'CREATE_TOAST'
export const HIDE_TOAST = 'HIDE_TOAST'
let id = 1
export const toast = (options: Object) => (title: string, message: ?string) => (dispatch: Function) => {
  const key = String(id++)
  dispatch({
    type: CREATE_TOAST,
    payload: {
      id: key,
      title,
      message,
      ...options
    }
  })
  setTimeout(() => dispatch({
    type: HIDE_TOAST,
    payload: {
      id: key,
    }
  }), 3000)
}

export const successToast = toast({type: 'success'})
export const errorToast = toast({type: 'error'})

const DEFAULT_STATE = {}
export const wispReducer = handleActions({
  [CREATE_TOAST]: (state, { payload }) => R.assoc(payload.id, payload, state),
  [HIDE_TOAST]: (state, { payload }) => R.dissoc(payload.id, state),
}, DEFAULT_STATE)

export const Toasts = connect(({toasts}) => ({toasts}))(({toasts}) => {
  return (
    <Animate className="toasts" transitionName="toast" transitionEnterTimeout={200} transitionLeaveTimeout={400}>
    {R.map((({title, message, id}) => (
      <div key={id} className="notification is-success">
        <h1 className="subtitle">{title}</h1>
      </div>
    )), R.values(toasts))}
  </Animate>
) })
