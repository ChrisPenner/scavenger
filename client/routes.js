export { Routes as API } from 'api'

export default {
    story: (uid) => `/stories/${uid}`,
    clue: (uid) => `/clues/${uid}`,
    answer: (uid) => `/answers/${uid}`,
    explorer: () => `/`,
    message: () => `/api/message`,
}

export const INDEX = ''
export const CREATE = 'create'
