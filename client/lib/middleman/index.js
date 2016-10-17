/* @flow */
import middleware from './middleware'
import { combineExtensionReducers } from './extensions'
export { INDEX, GET, DELETE, PUT } from './constants'

import type { ExtensionMap } from './extensions'

export type ConfigMap = {[key:string]: (state :Object, payload: Object) => Config }

export type Config = {
  identifier: string,
  route: string,
  method: string,
  extensions?: Object,
}

export default (actions: ConfigMap, extensions: ExtensionMap={}) => ({
  reducer: combineExtensionReducers(extensions),
  middleware: middleware(actions, extensions),
})
