/* @flow */

export {default as reducer} from './reducer'
import middleware from './middleware'

export { INDEX, GET, DELETE, PUT } from './constants'

export type ConfigMap = {[key:string]: (state :Object, payload: Object) => Config }

export type Config = {
  resource: string,
  route: string,
  method: string,
  before?: Function,
  after?: Function,
}

export const testMiddleman = (returnData:any, actions: Object = {}) => middleware(actions, ()=>Promise.resolve(returnData))

export const configureMiddleware = (config: ConfigMap) => middleware(config)
