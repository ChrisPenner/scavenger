export const STORE_RESULTS = 'STORE_RESULTS'
export const fetchResource = (Resource, type) => (dispatch) => {
    return Resource.index()
                .then(json => dispatch({
                    type,
                    key: Resource.key,
                    data: json,
                }))
}
const setter = (type) => (id) => (field, value) => ({
    type: type,
    id,
    field,
    value,
})

export const LOAD_CLUES = 'LOAD_CLUES'
export const LOAD_STORIES = 'LOAD_STORIES'
export const LOAD_ANSWERS = 'LOAD_ANSWERS'
export const CHANGE_STORY = 'CHANGE_STORY'
export const CHANGE_CLUE = 'CHANGE_CLUE'
export const CHANGE_ANSWER = 'CHANGE_ANSWER'
export const changeStory = setter(CHANGE_STORY)
export const changeClue = setter(CHANGE_CLUE)
export const changeAnswer = setter(CHANGE_ANSWER)
