import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import {Provider, connect} from 'react-redux'

import { Stories, Story } from './story'
import Clue from './clue'
import Routes from './routes'
import {fetchResource, LOAD_STORIES, LOAD_CLUES, LOAD_ANSWERS} from './actions'
import * as Res from './resources'

import store from './store'

const AppView = ({children, loading}) => {     
    if (loading) {
        return <div> Loading... </div>
    }
    return (
        <div className="container">
            {children}
        </div>
    )
}
const App = connect(({loading})=>({loading}))(AppView)

const Index = () => (
    <div>
        <Link to={Routes.stories()}> Stories </Link>
    </div>
)

const My404 = () => (
    <div> 404 :'( </div>
)

const load = (nextState, replace, callback) => {
    Promise.all([
            store.dispatch(fetchResource(Res.Story, LOAD_STORIES)),
            store.dispatch(fetchResource(Res.Clue, LOAD_CLUES)),
            store.dispatch(fetchResource(Res.Answer, LOAD_ANSWERS)),
    ]).then(()=>callback())
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App} onEnter={load}>
                <IndexRoute component={Index}/>
                <Route path={Routes.stories()}>
                    <IndexRoute component={Stories}/>
                    <Route path=':storyID' component={Story}/>
                </Route>
                <Route path='/clues/:clueID' component={Clue}/>
                <Route path="*" component={My404}></Route>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
)

export default App
