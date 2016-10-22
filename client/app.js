/* @flow */
import ReactDOM from 'react-dom'
import { Router, Route, IndexRedirect, Link, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import Animate from 'react-addons-css-transition-group'

import store from './store'

import Stories from './components/stories'
import Story from './components/story'
import CreateStory from './components/create-story'
import Codes from './components/codes'
import Groups from './components/groups'
import Clue from './components/clue'
import CreateClue  from './components/create-clue'
import Answer from './components/answer'
import CreateAnswer from './components/create-answer'
import * as Routes from './routes'
import * as Res from './resources'
import { initStories, initClues, initAnswers, initGroupMessages, initStoryMessages, initGroups, initCodes } from './actions'
import Explorer from './components/explorer'
import { GroupMessages, StoryMessages, } from './components/messages'
import MessageOverview from './components/messages-overview'
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

const loadStories = () => {
  store.dispatch(initStories())
  store.dispatch(initClues())
  store.dispatch(initAnswers())
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={syncHistoryWithStore(browserHistory, store)}>
      <Route
        path="/"
        component={App}
      >
        <IndexRedirect to={Res.Story.route(Routes.INDEX)} />
        <Route
          path={Res.Story.route(Routes.INDEX)}
          onEnter={loadStories}
          components={{ story: Stories }} />
        <Route
          path={Res.Group.route(Routes.GROUP_UID_PARAM)}
          components={{ main: Groups }} />
        <Route
          path={Res.Message.route(Routes.INDEX)}
          onEnter={() => {
            store.dispatch(initGroups())
            store.dispatch(initStories())
          }}
          components={{ main: MessageOverview }} />
        <Route
          path={Routes.groupMessages(Routes.GROUP_UID_PARAM)}
          onEnter={({params:{groupUid}}) => store.dispatch(initGroupMessages(groupUid))}
          components={{ main: GroupMessages }} />
        <Route
          path={Routes.storyMessages(Routes.STORY_UID_PARAM)}
          onEnter={({params:{storyUid}}) => store.dispatch(initStoryMessages(storyUid))}
          components={{ main: StoryMessages }} />
        <Route
          path={Routes.explorer()}
          components={{ main: Explorer }} />
        <Route
          path={Res.Code.route(Routes.INDEX)}
          onEnter={() => store.dispatch(initCodes())}
          components={{ main: Codes }} />
        <Route
          path={Res.Story.route(Routes.STORY_UID_PARAM)}
          onEnter={loadStories}
          components={{ story: Story }} />
        <Route
          path={Res.Clue.route(Routes.CLUE_UID_PARAM)}
          onEnter={loadStories}
          components={{ story: Story, clue: Clue }} />
        <Route
          path={Res.Answer.route(Routes.ANSWER_UID_PARAM)}
          onEnter={loadStories}
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
