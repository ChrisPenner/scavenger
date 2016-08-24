import R from 'ramda'

const concatWithColon = (prev, next) => `${prev}:${next}`
export const splitUid = (uid: string) => {
  const splitList = R.split(':', uid)
  const ids = R.zipObj(['storyId', 'clueId', 'answerId'], splitList)
  const uids = R.zipObj(['storyUid', 'clueUid', 'answerUid'], R.scan(concatWithColon, R.head(splitList), R.tail(splitList)))
  return R.merge(ids, uids)
}


export const uidsFromParams = (params: Object) => {
  const {storyId, clueId, answerId} = params
  const splitList = [storyId, clueId, answerId]
  const uids = R.zipObj(['storyUid', 'clueUid', 'answerUid'], R.scan(concatWithColon, R.head(splitList), R.tail(splitList)))
  return uids
}

