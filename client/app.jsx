import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

import { Stories, Story } from './stories'
import Routes from './routes'

const App = ({children}) => (
    <div> {children} </div>
)

const Index = () => (
    <div>
        <Link to={Routes.stories()}> Stories </Link>
    </div>
)

const My404 = () => (
    <div> 404 :'( </div>
)

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Index}/>
            <Route path={Routes.stories()} component={Stories}>
                <IndexRoute component={Stories}/>
                <Route path=':storyID' component={Story}/>
            </Route>
            <Route path="*" component={My404}></Route>
        </Route>
    </Router>,
    document.getElementById('app')
)

export default App
