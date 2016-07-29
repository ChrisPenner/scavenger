export { Routes as API } from './api'

export default {
    story: (id) => `/stories/${id}`,
    clue: (id) => `/clues/${id}`,
    answer: (id) => `/answers/${id}`,
}

export const INDEX = ''
