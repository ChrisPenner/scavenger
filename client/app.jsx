import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'

import Story from './story'

const Contents = () => (
    <div>
        <Link to="/story"> Story </Link>
    </div>
)

const Index = ({children}) => {
    const child = children || <Contents/>;
    return (
        <div>
            {child}
        </div>
    )}

const My404 = () => (
    <div> 404 :'( </div>
)

const App = () => (
    <Router history={browserHistory}>
        <Route path="/" component={Index}>
            <Route path="story" component={Story}></Route>
            <Route path="*" component={My404}></Route>
        </Route>
    </Router>
)

ReactDOM.render(
    <App/>,
    document.getElementById('app')
)

export default App
