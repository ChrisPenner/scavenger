/* @flow */
import ReactDOM from 'react-dom'
import { Router, Route, IndexRedirect, Link, browserHistory } from 'react-router'
import { Provider, connect } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import Animate from 'react-addons-css-transition-group'

import store from './store'

import { isLoaded } from './reducers'
import { Stories, Story, CreateStory, StoryCode } from './story'
import { Groups } from './group'
import { Clue, CreateClue } from './clue'
import { Answer, CreateAnswer } from './answer'
import * as Routes from './routes'
import { loadStory, loadStoryCodes, loadClue, loadAnswer, loadGroup, loadMessage } from './actions'
import { Explorer } from './explorer'
import { GroupMessages, StoryMessages, MessageChoices } from './message'
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
            to={Routes.messagesIndex()}
            activeClassName="is-active"
            className="nav-item is-tab"> Messages
          </Link>
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
          <Link
            to={Routes.storycode()}
            activeClassName="is-active"
            className="nav-item is-tab"> Stories
          </Link>
          <Link
            to={Routes.groups()}
            activeClassName="is-active"
            className="nav-item is-tab"> Groups
          </Link>
        </div>
      </nav>
      <Toasts/>
      <section className="section is-fullwidth">
        {main ? main : (
          <Animate className="columns" transitionName="card" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
            { story ?  (<div className="column is-4"> {story} </div>) : null }
            { clue ?  (<div className="column is-4"> {clue} </div>) : null }
            { answer ?  (<div className="column is-4"> {answer} </div>) : null }
          </Animate>
          )}

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
  store.dispatch(loadStoryCodes())
  store.dispatch(loadClue())
  store.dispatch(loadAnswer())
  store.dispatch(loadGroup())
  store.dispatch(loadMessage())
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
          path={Routes.groups()}
          components={{ main: Groups }} />
        <Route
          path={Routes.messagesIndex()}
          components={{ main: MessageChoices }} />
        <Route
          path={Routes.groupMessages()}
          components={{ main: GroupMessages }} />
        <Route
          path={Routes.storyMessages()}
          components={{ main: StoryMessages }} />
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
