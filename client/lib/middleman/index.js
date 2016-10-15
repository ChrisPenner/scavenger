/* @flow */

export {default as reducer} from './reducer'
import middleware from './middleware'
import type {ExtensionMap} from './extensions'

export { INDEX, GET, DELETE, PUT } from './constants'

export type ConfigMap = {[key:string]: (state :Object, payload: Object) => Config }

export type Config = {
  resource: string,
  route: string,
  method: string,
  extensions?: Object,
}

export const testMiddleman = (returnData:any, actions: Object = {}) => middleware(actions, {}, ()=>Promise.resolve(returnData))

export const configureMiddleware = (config: ConfigMap, extensions: ExtensionMap) => middleware(config, extensions)
