import changeCase from 'change-case'
import Routes, { INDEX } from 'api'

const mapKeys = R.curry((f, obj) =>
  R.fromPairs(R.map(R.adjust(f, 0), R.toPairs(obj))));
const camelize = mapKeys(changeCase.camelCase)
const snakify = mapKeys(changeCase.snakeCase)

const createResource = ({route, factory}) => {
    return class Resource {
        static index(){
            return fetch(route(INDEX))
                .then(resp => resp.json())
                .then(R.map(camelize))
        }

        static get(uid){
            return fetch(route(uid))
                .then(resp => resp.json())
                .then(camelize)
        }

        static put(uid, payload){
            return fetch(route(uid), {
                method: 'put',
                body: JSON.stringify(snakify(payload)),
            }).then(resp => resp.json())
              .then(camelize)
        }

        static post(uid, payload){
            return fetch(route(uid), {
                method: 'post',
                body: JSON.stringify(snakify(payload)),
            }).then(resp => resp.json())
              .then(camelize)
        }

        static new(args){
            return factory(args)
        }
    }
}

const storyFactory = (args) => ({
    uid: null,
    defaultHint: '',
    clues: [],
    ...args,
})

const clueFactory = (args) => ({
    uid: null,
    storyUid: null,
    text: '',
    hint: '',
    mediaUrl: '',
    answers: [],
    ...args,
})

const answerFactory = (args) => ({
    uid: null,
    storyUid: null,
    clueUid: null,
    pattern: '',
    nextClue: '',
    ...args,
})

export const Story = createResource({ route: Routes.story, factory: storyFactory })
export const Clue = createResource({ route: Routes.clue, factory: clueFactory })
export const Answer = createResource({ route: Routes.answer, factory: answerFactory })
