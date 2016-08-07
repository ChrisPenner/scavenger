import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import {Provider, connect} from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'

import store from 'store'

import { Stories, Story, CreateStory } from 'story'
import { Clue, CreateClue } from 'clue'
import { CreateAnswer } from 'answer'
import Routes, { INDEX, CREATE } from 'routes'
import {fetchResource, loadStories, loadClues, loadAnswers} from 'actions'
import * as Res from 'resources'
import {Clues} from 'clue'
import {Explorer} from 'explorer'


const App = connect(({loading})=>({loading}))(
({children, loading}) => {
    if (loading) {
        return <div> Loading... </div>
    }
    return (
        <div>
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <Link to="/" className="navbar-brand" >Scavenger</Link>
                    </div>
                    <ul className="nav navbar-nav">
                        <li>
                            <Link activeClassName="active" to={Routes.explorer()}>Explorer</Link>
                        </li>
                        <li>
                            <Link activeClassName="active" to={Routes.story(INDEX)}>Stories</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="container-fluid">
                {children}
            </div>
        </div>
    )
})

const My404 = () => (
    <div> 404 :'( </div>
)

const load = (nextState, replace, callback) => {
    Promise.all([
            store.dispatch(loadStories),
            store.dispatch(loadClues),
            store.dispatch(loadAnswers),
    ]).then(()=>callback())
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={syncHistoryWithStore(browserHistory, store)}>
            <Route path="/" component={App} onEnter={load}>
                <Route path={Routes.story(CREATE)} component={CreateStory} />
                <Route path={Routes.clue(CREATE)} component={CreateClue} />
                <Route path={Routes.answer(CREATE)} component={CreateAnswer} />
                <IndexRoute component={Explorer}/>
                <Route path={Routes.clue(':clueUid') } component={Clue}/>
                <Route path={Routes.story(INDEX)}>
                    <IndexRoute component={Stories}/>
                    <Route path=':storyUid' component={Story}>
                        <IndexRoute component={Clues}/>
                    </Route>
                </Route>
                <Route path="*" component={My404}></Route>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
)

export default App
