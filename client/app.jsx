import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

import { Stories, Story } from './story'
import { Clue } from './clue'
import Routes from './routes'

const App = ({children}) => (
    <div className="container"> {children} </div>
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
            <Route path={Routes.stories()}>
                <IndexRoute component={Stories}/>
                <Route path=':storyUID' component={Story}/>
            </Route>
            <Route path='/clues/:clueUID' component={Clue}/>
            <Route path="*" component={My404}></Route>
        </Route>
    </Router>,
    document.getElementById('app')
)

export default App
