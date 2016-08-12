import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import {Provider, connect} from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'

import store from 'store'

import { Stories, Story, CreateStory } from 'story'
import { Clue, CreateClue } from 'clue'
import { Answer } from 'answer'
import { CreateAnswer } from 'answer'
import Routes, { INDEX} from 'routes'
import {fetchResource, loadStories, loadClues, loadAnswers} from 'actions'
import * as Res from 'resources'
import {Explorer} from 'explorer'


const App = connect(({loading})=>({loading}))(
({main, loading, story, clue, answer}) => {
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
                {main ? main : (
                    <div className="row">
                        <div className="col-sm-4">
                            {story}
                        </div>
                        <div className="col-sm-4">
                            {clue}
                        </div>
                        <div className="col-sm-4">
                            {answer}
                        </div>
                    </div>)
                }
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
                <Route path={Routes.explorer()} components={{ main:Explorer }}/>
                <Route path={Routes.story(INDEX)} components={{story:Stories}}/>
                <Route path={Routes.story()} components={{story:Story}}/>
                <Route path={Routes.clue()} components={{story:Story, clue:Clue}}/>
                <Route path={Routes.answer()} components={{story:Story, clue:Clue, answer: Answer}}/>
                <Route path={Routes.createStory()} components={{main: CreateStory}}/>
                <Route path={Routes.createClue()} components={{main: CreateClue}}/>
            </Route>
            <Route path="*" component={My404} />
        </Router>
    </Provider>,
    document.getElementById('app')
)

export default App
