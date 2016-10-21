import at from '../actions/types'
const { saga } = at
import { takeLatest, takeEvery } from 'redux-saga'
import { put, take } from 'redux-saga/effects'
import { reorderClue, reorderAnswer } from '../actions'
import { sendExplorerMessage } from './explorer'

import { Story, Clue, Answer } from '../resources'
import { saveResource, delResource } from './restful'

function* startDragAnswer({ payload:uid }) {
  const { payload:index } = yield take(at.DROP_ANSWER)
  yield put(reorderAnswer({ uid, index }))
}

function* startDragClue({ payload:uid }) {
  const { payload:index } = yield take(at.DROP_CLUE)
  yield put(reorderClue({ uid, index }))
}

export default function* rootSaga()  {
  yield* [
    takeLatest(at.START_DRAG_CLUE, startDragClue),
    takeLatest(at.START_DRAG_ANSWER, startDragAnswer),
    takeEvery(saga(at.SEND_MESSAGE), sendExplorerMessage),

    takeEvery(Story.types.saga.save, saveResource(Story)),
    takeEvery(Clue.types.saga.save, saveResource(Clue)),
    takeEvery(Answer.types.saga.save, saveResource(Answer)),

    takeEvery(Story.types.del, delResource(Story)),
    takeEvery(Clue.types.del, delResource(Clue)),
    takeEvery(Answer.types.del, delResource(Answer)),

  ]
}

