import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'

const Index = ({children}) => (
    <div>
    </div>
)

const My404 = () => (
    <div> 404 :'( </div>
)

const App = () => (
    <Router history={browserHistory}>
        <Route path="/" component={Index}></Route>
        <Route path="*" component={My404}></Route>
    </Router>
)

ReactDOM.render(
    <App/>,
    document.getElementById('app')
)

export default App
