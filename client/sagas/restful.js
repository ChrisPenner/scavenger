import swal from 'sweetalert2'
import { put, select, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { successToast, errorToast } from '../lib/wisp'

import type { ResourceT } from '../resources'

export const saveResource = (resource: ResourceT) => function* saveResource ({payload:uid}) {
  const currentState = yield select(resource.selectors.get, uid)
  try {
    yield call(resource.api.save, currentState)
    yield put(successToast('Saved'))
  } catch(err) {
    yield put(errorToast('Failed to Save'))
  }
}

export const delResource = (resource: ResourceT) => function* delResource ({payload}) {
  const {uid, route} = payload
  const proceed = yield swal({
    title: 'Delete?',
    type: 'warning',
    showCancelButton: true,
    showLoaderOnConfirm: true,
  }).then(() => true).catch(() => false)
  if(! proceed){
    return
  }

  try {
    if (route){
      yield put(push(route))
    }
    yield call(resource.api.del, uid)
    yield put(resource.actions.saga.del({uid}))
    yield put(successToast('Deleted'))
    yield swal({
      title: 'Deleted',
      type: 'success',
      showConfirmButton: false,
      timer: 700,
    }).catch(swal.noop)
  } catch(err) {
    swal('Error', err.toString(), 'error')
  }
}
