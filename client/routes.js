export { Routes as API } from './api'

export default {
    stories: () => `/stories/`,
    story: (storyID) => `/stories/${storyID}`,
    clues: () => `/clues/`,
    clue: (clueID) => `/clues/${clueID}`,
}
