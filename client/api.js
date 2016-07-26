const story = (storyID) => `/stories/${storyID}.json`
const stories = () => `/stories.json`
const clue = (clueUID) => `/clues/${clueUID}.json`
const clues = (storyUID) => `/stories/${storyUID}/clues.json`
const answersByClue = (clueUID) => `/clues/${clueUID}/answers.json`

export const Routes = {
    story, stories,
    clue, clues,
    answersByClue,
}
