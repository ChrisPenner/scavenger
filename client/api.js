const story = (uid) => `/api/stories/${uid}`
const clue = (uid) => `/api/clues/${uid}`
const answer = (uid) => `/api/answers/${uid}`

const Routes = {
    story, clue, answer,
}

export default Routes

export const INDEX = ''
