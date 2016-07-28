const story = (storyID) => `/stories/${storyID}.json`
const stories = () => `/stories.json`
const clue = (clueUID) => `/clues/${clueUID}.json`
const clues = () => `/clues.json`
const answers = () => `/answers.json`

export const Routes = {
    story, stories,
    clue, clues,
    answers,
}
