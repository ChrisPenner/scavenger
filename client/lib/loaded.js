/* @flow */
import R from 'ramda'
import { connect } from 'react-redux'

const stateToProps = state => ({api: state.api})

const loadingGuard = (dependencies: Array<string>) => (Component: ReactClass<*>)=> connect(stateToProps)(({api, ...props}: Object) => {
  const isLoaded = (resource) => {
    return api[resource] && api[resource].initialized
  }
  if (!R.all(isLoaded, dependencies)){
    return (
      <div className="sk-folding-cube">
        <div className="sk-cube1 sk-cube"></div>
        <div className="sk-cube2 sk-cube"></div>
        <div className="sk-cube4 sk-cube"></div>
        <div className="sk-cube3 sk-cube"></div>
      </div>
    )
  }
  return <Component {...props} />
})
export default loadingGuard
