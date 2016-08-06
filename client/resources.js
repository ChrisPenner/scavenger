import toastr from 'toastr'
import changeCase from 'change-case'
import Routes, { INDEX } from 'api'

const mapKeys = R.curry((f, obj) =>
  R.fromPairs(R.map(R.adjust(f, 0), R.toPairs(obj))));

const deepMapKeys = R.curry((f, data) => {
    switch (R.type(data)){
        case "Object":
            return mapKeys(f, data)
        case "Array":
            return R.map(mapKeys(f),  data)
        default:
            return data
    }
})

const camelize = mapKeys(changeCase.camelCase)
const snakify = mapKeys(changeCase.snakeCase)


const handleError = err => {
    toastr.success('title', 'tohea')
}

const processResponse = (respPromise) => {
    return respPromise.then(resp => resp.json())
        .then(json => {
            if (json.error){
                throw json.error
            }
            return json.data
        }).catch(handleError)
}

const createResource = ({route, factory}) => {
    return class Resource {
        static index(){
            return R.compose(processResponse, fetch, route)(INDEX)
                .then(R.map(camelize))
                .then(stuff => {console.log('break', stuff); return stuff})
        }

        static get(uid){
            return R.compose(processResponse, fetch, route)(uid)
                .then(camelize)
        }

        static put(uid, payload){
            return processResponse(fetch(route(uid), {
                method: 'put',
                body: JSON.stringify(snakify(payload)),
            }))
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
