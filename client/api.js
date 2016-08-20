/* @flow */
const story = (uid: string) => `/api/stories/${uid}`
const clue = (uid: string) => `/api/clues/${uid}`
const answer = (uid: string) => `/api/answers/${uid}`

const Routes = {
    story, clue, answer,
}

export default Routes

export const INDEX = ''
