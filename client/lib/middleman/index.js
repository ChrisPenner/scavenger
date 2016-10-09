/* @flow */

import reducer from './reducer'
import middleware from './middleware'

export { INDEX, GET, DELETE, PUT } from './constants'
export type Config = {[key:string]: (state :Object, payload: Object) => Object }

export const testMiddleman = (returnData:any) => middleware(()=>Promise.resolve(returnData))
export default (config: Config, makeRequest?: Function) => ({
  middleware: middleware(config, makeRequest),
  reducer: reducer(config),
})
