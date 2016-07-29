import Routes, { INDEX } from './api'

const createResource = (route) => {
    return class Resource {
        static index(){
            return fetch(route(INDEX))
                .then(resp => resp.json())
        }

        static get(id){
            return fetch(route(id))
                .then(resp => resp.json())
        }

        static put(id, data){
            return fetch(route(id), {
                method: 'put',
                body: JSON.stringify(data),
            }).then(resp => resp.json())
        }
    }
}

export const Story = createResource(Routes.story)
export const Clue = createResource(Routes.clue)
export const Answer = createResource(Routes.answer)
