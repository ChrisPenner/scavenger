export { Routes as API } from 'api'

export default {
    story: (uid) => `/stories/${uid}`,
    clue: (uid) => `/clues/${uid}`,
    answer: (uid) => `/answers/${uid}`,
}

export const INDEX = ''
export const CREATE = 'create'
