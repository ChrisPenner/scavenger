/* @flow */
import ReactDOM from 'react-dom'
import { Router, Route, IndexRedirect, Link, browserHistory } from 'react-router'
import { Provider, connect } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'

import store from './store'

import { isLoaded } from './reducers'
import { Stories, Story, CreateStory } from './story'
import { Clue, CreateClue } from './clue'
import { Answer, CreateAnswer } from './answer'
import * as Routes from './routes'
import { loadStory, loadClue, loadAnswer } from './actions'
import { Explorer } from './explorer'
import { Toasts } from './lib/wisp'

type appArgs = {main: any, story: any, clue: any, answer: any}
const App = connect(state => ({loaded: isLoaded(state)}))
(({loaded, main, story, clue, answer}) => {
  if (!loaded){
    return <div>Loading...</div>
  }
  return (
    <div>
      <nav className="nav has-shadow">
        <div className="nav-left">
          <span className="nav-item is-brand">Look-Go</span>
        </div>
        <div className="nav-right">
          <Link
            to={Routes.explorer()}
            activeClassName="is-active"
            className="nav-item is-tab"> Explorer
          </Link>
          <Link
            to={Routes.stories()}
            activeClassName="is-active"
            className="nav-item is-tab"> Stories
          </Link>
        </div>
      </nav>
      <Toasts/>
      <section className="section is-fullwidth">
        {main ? main : (
          <div className="columns">
            {story ?
              (<div className="column is-4">
                {story}
              </div>)
              : null}
              {clue ?
                (<div className="column is-4">
                  {clue}
                </div>)
                : null}
                {answer ?
                  (<div className="column is-4">
                    {answer}
                  </div>)
                  : null}
                </div>)}
              </section>
            </div>
  )})

const My404 = () => (
  <div>
    404 :'(
  </div>
)

const load = () => {
  store.dispatch(loadStory())
  store.dispatch(loadClue())
  store.dispatch(loadAnswer())
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={syncHistoryWithStore(browserHistory, store)}>
      <Route
        path="/"
        component={App}
        onEnter={load}>
        <IndexRedirect to={Routes.stories()} />
        <Route
          path={Routes.stories()}
          components={{ story: Stories }} />
        <Route
          path={Routes.explorer()}
          components={{ main: Explorer }} />
        <Route
          path={Routes.story()}
          components={{ story: Story }} />
        <Route
          path={Routes.clue()}
          components={{ story: Story, clue: Clue }} />
        <Route
          path={Routes.answer()}
          components={{ story: Story, clue: Clue, answer: Answer }} />
        <Route
          path={Routes.createStory()}
          components={{ main: CreateStory }} />
        <Route
          path={Routes.createClue()}
          components={{ main: CreateClue }} />
        <Route
          path={Routes.createAnswer()}
          components={{ main: CreateAnswer }} />
      </Route>
      <Route
        path="*"
        component={My404} />
    </Router>
  </Provider>,
  document.getElementById('app')
)

export default App
