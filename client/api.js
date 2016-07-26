const story = (storyID) => `/stories/${storyID}.json`
const stories = () => `/stories.json`
const clue = (storyID, clueID) => `/stories/${storyID}/clues/${clueID}.json`
const clues = () => `/clues.json`
export const Routes = {
    story, stories,
    clue, clues,
}
