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

export {Story}
