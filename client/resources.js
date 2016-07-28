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
    static index(){
        return fetch(Routes.clues())
            .then(resp => resp.json())
    }

    static get(clueUID){
        return fetch(Routes.clue(clueUID))
            .then(resp => resp.json())
    }
}

class Answer {
    static index(){
        return fetch(Routes.answers())
            .then(resp => resp.json())
    }

    static byClue(clueUID){
        return fetch(Routes.answersByClue(clueUID))
            .then(resp => resp.json())
    }
}

export {Story, Clue, Answer}
