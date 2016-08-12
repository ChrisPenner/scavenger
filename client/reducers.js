import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import * as at from 'action-types'

const concatWithColon = (prev, next) => `${prev}:${next}`
export const splitUid = (uid) => {
    const splitList = R.split(':', uid)
    const ids = R.zipObj(['storyId', 'clueId', 'answerId'], splitList)
    const uids = R.zipObj(['storyUid', 'clueUid', 'answerUid'], R.scan(concatWithColon, R.head(splitList), R.tail(splitList)))
    return R.merge(ids, uids)
}

export const uidsFromParams = (params) => {
    const {storyId, clueId, answerId} = params
    const splitList = [storyId, clueId, answerId]
    const uids = R.zipObj(['storyUid', 'clueUid', 'answerUid'], R.scan(concatWithColon, R.head(splitList), R.tail(splitList)))
    return uids
}

const stories = (stories={}, action) => {
    switch (action.type) {
        case at.LOAD_STORIES:
            return action.payload
        case at.CHANGE_STORY:
            return R.assocPath(action.path, action.value, stories)
        case at.SET_CLUE:
            const { storyUid } = splitUid(action.payload.uid)
            return R.evolve({[storyUid]: {clues: R.append(action.payload.uid)}}, stories)
        case at.SET_STORY:
            return R.assoc(action.payload.uid, action.payload, stories)
        default:
            return stories
    }
}

const clues = (clues={}, action) => {
    switch (action.type) {
        case at.LOAD_CLUES:
            return action.payload
        case at.CHANGE_CLUE:
            return R.assocPath(action.path, action.value, clues)
        case at.SET_CLUE:
            return R.assoc(action.payload.uid, action.payload, clues)
        case at.SET_ANSWER:
            const { clueUid } = splitUid(action.payload.uid)
            return R.evolve({[clueUid]: {answers: R.append(action.payload.uid)}}, clues)
        default:
            return clues
    }
}

const answers = (answers={}, action) => {
    switch (action.type) {
        case at.LOAD_ANSWERS:
            return action.payload
        case at.CHANGE_ANSWER:
            return R.assocPath(action.path, action.value, answers)
        case at.SET_ANSWER:
            return R.assoc(action.payload.uid, action.payload, answers)
        default:
            return answers
    }
}

const explorer = (explorer={text:'', toNumber:'', fromNumber:'', texts:[]}, action) => {
    switch (action.type) {
        case at.CHANGE_EXPLORER:
            return R.assocPath(action.path, action.value, explorer)
        case at.RECEIVE_MESSAGE:
        case at.SEND_MESSAGE:
            return R.evolve({texts: R.prepend(action.message)})(explorer)
        default:
            return explorer
    }
}

export default combineReducers({
    routing: routerReducer,
    stories,
    clues,
    answers,
    explorer,
})

const listFromMapping = (mapping) => Object.keys(mapping).map(key => mapping[key])

export const getClue = (state, clueUid) => state.clues[clueUid]
export const getClues = (state) => state.clues
export const getClueUidsByStory = (state, storyUid) => getStory(state, storyUid).clues
export const getCluesList = (state) => listFromMapping(state.clues)
export const getCluesByStory = (state, storyUid) => {
    const equalsStoryUid = R.compose(R.equals(storyUid), R.prop('storyUid'))
    return getCluesList(state).filter(equalsStoryUid)
}
export const getCluesListByStory = (state, storyUid) => listFromMapping(getCluesByStory(state, storyUid))

export const getStory = (state, storyUid) => state.stories[storyUid]
export const getStories = (state) => state.stories
export const getStoriesList = (state) => listFromMapping(state.stories)

export const getAnswer = (state, answerUid) => state.answers[answerUid]
export const getAnswers = (state) => state.answers
export const getAnswersByClue = (state, clueUid) => getClue(state, clueUid).answers.map(answerUid=>getAnswer(state, answerUid))
export const getAnswersListByClue = (state, clueUid) => listFromMapping(getAnswersByClue(state, clueUid))

export const getExplorer = (state) => state.explorer
