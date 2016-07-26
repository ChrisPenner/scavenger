import { Routes } from './api'

class Story {
    static index(){
        return fetch(Routes.stories())
    }

    static put(storyID, changes){
        console.log('putting:', storyID, changes)
        return fetch(Routes.story(storyID), {
            method: 'PUT',
            body: JSON.stringify(changes),
        })
    }

    static get(storyID){
        console.log(`Getting ${storyID}`)
        return fetch(Routes.story(storyID))
    }
}

class Clue {
    static index(){
        return fetch(Routes.clues())
    }

    static put(storyID, clueID, changes){
        console.log('putting:', clueID, changes)
        return fetch(Routes.clue(clueID), {
            method: 'PUT',
            body: JSON.stringify(changes),
        })
    }

    static get(storyID, clueID){
        console.log(`Getting ${clueID}`)
        return fetch(Routes.clue(clueID))
    }
}

export {Story, Clue}
