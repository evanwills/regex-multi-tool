import {
  combineReducers,
  createStore,
  applyMiddleware,
  compose
} from '../redux/redux.mjs'
import {
  logger,
  crashReporter
  // readyStatePromise,
  // thunk
  // timeoutScheduler,
  // readyStatePromise,
  // vanillaPromise,
} from '../redux/standard-middleware.mjs'
import { modeReducer, groupsReducer } from './main-app/main-app.state.reducers.mjs'
import { mainAppMW } from './main-app/main-app.state.middleware.mjs'
import { oneOff } from './oneOff/oneOff.state.mjs'
import { repeatable } from './repeatable/repeatable.state.mjs'
import { userSettings } from './user-settings/user-settings.state.mjs'
import { isStr } from '../utilities/validation.mjs'
import { urlReducer } from './url/url.state.all.mjs'
import { url } from '../url.mjs'

const initialState = {
  mode: 'repeatable',
  groups: '',
  oneOff: oneOff.state,
  repeat: repeatable.state,
  url: url,
  userSettings: userSettings.state
}

if (isStr(url.searchParams.mode)) {
  const mode = url.searchParams.mode.trim().substr(0, 6)
  if (mode === 'oneOff' || mode === 'repeat') {
    initialState.mode = mode
  }
}

if (initialState.mode === 'oneOff' && url.hash !== '') {
  const hash = url.hash.substr(1).toLowerCase()
  const screens = ['input', 'regex', 'matches', 'output']
  if (screens.indexOf(hash) > -1) {
    initialState.oneOff.screen = hash
  }
}

export const store = createStore(
  combineReducers({
    mode: modeReducer,
    groups: groupsReducer,
    oneOff: oneOff.reducers,
    repeatable: repeatable.reducers,
    url: urlReducer,
    userSettings: userSettings.reducer
    // userSettings: (state = userSettings.state, action) => state
  }),
  initialState,
  compose(
    applyMiddleware(
      crashReporter,
      logger,
      userSettings.middleware,
      mainAppMW,
      oneOff.middleware,
      repeatable.middleware
    )

  )
  //  && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
