const story = (storyID) => `/api/stories/${storyID}`
const stories = () => `/api/stories/`
const clue = (clueUID) => `/api/clues/${clueUID}`
const clues = () => `/api/clues/`
const answers = () => `/api/answers/`

export const Routes = {
    story, stories,
    clue, clues,
    answers,
}
