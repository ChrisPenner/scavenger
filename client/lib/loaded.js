/* @flow */
import R from 'ramda'
import { connect } from 'react-redux'

const stateToProps = state => ({api: state.api})

const loadingGuard = (dependencies: Array<string>) => (Component: ReactClass<*>)=> connect(stateToProps)(({api, ...props}: Object) => {
  const isLoaded = (resource) => {
    return api[resource] && api[resource].initialized;
  }
  if (!R.all(isLoaded, dependencies)){
    return <div> Loading... </div>
  }
  return <Component {...props} />
})
export default loadingGuard
