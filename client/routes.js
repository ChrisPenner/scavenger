export { Routes as API } from './api'

export default {
    stories: () => `/stories/`,
    story: (storyID) => `/stories/${storyID}`,
}
