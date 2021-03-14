import {
  combineReducers,
  createStore,
  applyMiddleware,
  compose
} from '../redux/redux.mjs'
import {
  logger,
  crashReporter,
  // readyStatePromise,
  // thunk
  // timeoutScheduler,
  // readyStatePromise,
  // vanillaPromise,
} from '../redux/standard-middleware.mjs'
import { modeReducer } from './main-app/main-app.state.reducers.mjs'
import { oneOff } from './oneOff/oneOff.state.mjs'
import { repeatable } from './repeatable/repeatable.state.mjs'
import { isStr, getURLobject } from '../utility-functions.mjs'

const initialState = {
  mode: 'oneOff',
  oneOff: oneOff.state,
  repeat: repeatable.state
}

const url = getURLobject(window.location)

if (isStr(url.searchParams.mode)) {
  const mode = url.searchParams.mode.trim()
  if (mode === 'oneOff' || mode === 'repeatable') {
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
    oneOff: oneOff.reducers,
    repeat: repeatable.reducers
  }),
  initialState,
  compose(
    applyMiddleware(
      logger,
      crashReporter,
      oneOff.middleware,
      repeatable.middleware
    )
  )
)
