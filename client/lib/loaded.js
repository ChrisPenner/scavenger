/* @flow */
import R from 'ramda'
import { connect } from 'react-redux'

const stateToProps = state => ({pending: state.pending})

const loadingGuard = (dependencies: Array<string>) => (Component: ReactClass<*>)=> connect(stateToProps)(({pending, ...props}: Object) => {
  const isLoaded = (resource) => {
    return pending[resource] && pending[resource].initialized;
  }
  if (!R.all(isLoaded, dependencies)){
    return <div> Loading... </div>
  }
  return <Component {...props} />
})
export default loadingGuard
