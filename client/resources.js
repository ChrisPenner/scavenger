import { Routes } from './api'

class Story {
    static index(){
        return fetch(Routes.stories())
            .then(resp => resp.json())
    }

    static get(storyUID){
        return fetch(Routes.story(storyUID))
            .then(resp => resp.json())
    }
}

class Clue {
    static index(storyUID){
        return fetch(Routes.clues(storyUID))
            .then(resp => resp.json())
    }

    static get(clueUID){
        return fetch(Routes.clue(clueUID))
            .then(resp => resp.json())
    }
}

class Answer {
    static byClue(clueUID){
        return fetch(Routes.answersByClue(clueUID))
            .then(resp => resp.json())
    }
}

export {Story, Clue, Answer}
