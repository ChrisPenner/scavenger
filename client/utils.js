/* @flow */
import R from 'ramda'

type Uids = {
  storyUid: string,
  clueUid: string,
  answerUid: string,
}

const concatWithColon = (prev, next) => `${prev}:${next}`
export const splitUid = (uid: string): Uids => {
  const splitList = R.split(':', uid)
  const uids = R.zipObj(['storyUid', 'clueUid', 'answerUid'], R.scan(concatWithColon, R.head(splitList), R.tail(splitList)))
  return uids
}

export const uidsFromParams = (params: Object) => {
  const {storyUid, clueUid, answerUid} = params
  return splitUid(storyUid || clueUid || answerUid)
}

