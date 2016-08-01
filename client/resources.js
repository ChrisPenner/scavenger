import Routes, { INDEX } from 'api'

const createResource = ({route, factory}) => {
    return class Resource {
        static index(){
            return fetch(route(INDEX))
                .then(resp => resp.json())
        }

        static get(id){
            return fetch(route(id))
                .then(resp => resp.json())
        }

        static put(id, payload){
            return fetch(route(id), {
                method: 'put',
                body: JSON.stringify(payload),
            }).then(resp => resp.json())
        }

        static post(id, payload){
            return fetch(route(id), {
                method: 'post',
                body: JSON.stringify(payload),
            }).then(resp => resp.json())
        }

        static new(args){
            return factory(args)
        }
    }
}

const storyFactory = (args) => ({
    uid: null,
    default_hint: '',
    clues: [],
    ...args,
})

const clueFactory = (args) => ({
    uid: null,
    text: '',
    hint: '',
    media_url: '',
    answers: [],
    ...args,
})

const answerFactory = (args) => ({
    uid: null,
    pattern: '',
    next_clue: '',
    ...args,
})

export const Story = createResource({ route: Routes.story, factory: storyFactory })
export const Clue = createResource({ route: Routes.clue, factory: clueFactory })
export const Answer = createResource({ route: Routes.answer, factory: answerFactory })
