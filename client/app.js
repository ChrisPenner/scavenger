/* @flow */
import ReactDOM from 'react-dom'
import { Router, Route, IndexRedirect, Link, browserHistory } from 'react-router'
import { Provider, connect } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import Animate from 'react-addons-css-transition-group'

import store from './store'

import { Stories, Story, CreateStory } from './story'
import { Codes } from './codes'
import { Groups } from './group'
import { Clue, CreateClue } from './clue'
import { Answer, CreateAnswer } from './answer'
import * as Routes from './routes'
import * as Res from './resources'
import { fetchStory, fetchClue, fetchAnswer, fetchCode, fetchGroup, fetchMessage } from './actions'
import { Explorer } from './explorer'
import { GroupMessages, StoryMessages, MessageOverview } from './message'
import { Toasts } from './lib/wisp'

type appArgs = {main: ReactClass<*>, story: ReactClass<*>, clue: ReactClass<*>, answer: ReactClass<*>}
const App = ({main, story, clue, answer}: appArgs) => {
  return (
    <div>
      <nav className="nav has-shadow">
        <div className="nav-left">
          <span className="nav-item is-brand">Look-Go</span>
        </div>
        <div className="nav-right">
          <Link
            to={Res.Message.route(Routes.INDEX)}
            activeClassName="is-active"
            className="nav-item is-tab"> Messages
          </Link>
          <Link
            to={Routes.explorer(Routes.INDEX)}
            activeClassName="is-active"
            className="nav-item is-tab"> Explorer
          </Link>
          <Link
            to={Res.Story.route(Routes.INDEX)}
            activeClassName="is-active"
            className="nav-item is-tab"> Stories
          </Link>
          <Link
            to={Res.Code.route(Routes.INDEX)}
            activeClassName="is-active"
            className="nav-item is-tab"> Codes
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
  )}

const My404 = () => (
  <div>
    404 :'(
  </div>
)

const load = () => {
  store.dispatch(fetchStory())
  store.dispatch(fetchCode())
  store.dispatch(fetchClue())
  store.dispatch(fetchAnswer())
  store.dispatch(fetchGroup())
  store.dispatch(fetchMessage())
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={syncHistoryWithStore(browserHistory, store)}>
      <Route
        path="/"
        component={App}
        onEnter={load}>
        <IndexRedirect to={Res.Story.route(Routes.INDEX)} />
        <Route
          path={Res.Story.route(Routes.INDEX)}
          components={{ story: Stories }} />
        <Route
          path={Res.Group.route(Routes.GROUP_UID_PARAM)}
          components={{ main: Groups }} />
        <Route
          path={Res.Message.route(Routes.INDEX)}
          components={{ main: MessageOverview }} />
        <Route
          path={Routes.groupMessages(Routes.GROUP_UID_PARAM)}
          components={{ main: GroupMessages }} />
        <Route
          path={Routes.storyMessages(Routes.STORY_UID_PARAM)}
          components={{ main: StoryMessages }} />
        <Route
          path={Routes.explorer()}
          components={{ main: Explorer }} />
        <Route
          path={Res.Story.route(Routes.STORY_UID_PARAM)}
          components={{ story: Story }} />
        <Route
          path={Res.Code.route(Routes.INDEX)}
          components={{ main: Codes }} />
        <Route
          path={Res.Clue.route(Routes.CLUE_UID_PARAM)}
          components={{ story: Story, clue: Clue }} />
        <Route
          path={Res.Answer.route(Routes.ANSWER_UID_PARAM)}
          components={{ story: Story, clue: Clue, answer: Answer }} />
        <Route
          path={Routes.createStory()}
          components={{ main: CreateStory }} />
        <Route
          path={Routes.createClue(Routes.STORY_UID_PARAM)}
          components={{ main: CreateClue }} />
        <Route
          path={Routes.createAnswer(Routes.CLUE_UID_PARAM)}
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
