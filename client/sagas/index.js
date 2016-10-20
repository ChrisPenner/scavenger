import at from '../actions/types'
import { takeLatest } from 'redux-saga'
import { put, take } from 'redux-saga/effects'
import { reorderClue, reorderAnswer } from '../actions'

export default function* rootSaga(): any {
  yield* [
    takeLatest(at.START_DRAG_CLUE, startDragClue),
    takeLatest(at.START_DRAG_ANSWER, startDragAnswer),
  ]
}

function* startDragAnswer({payload:uid}): any {
  const { payload:index } = yield take(at.DROP_ANSWER)
  yield put(reorderAnswer({ uid, index }))
}

function* startDragClue({payload:uid}): any {
  const { payload:index } = yield take(at.DROP_CLUE)
  yield put(reorderClue({ uid, index }))
}
