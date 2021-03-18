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
import { modeReducer } from './main-app/main-app.state.reducers.mjs'
import { oneOff } from './oneOff/oneOff.state.mjs'
import { repeatable } from './repeatable/repeatable.state.mjs'
import { isStr, getURLobject } from '../utility-functions.mjs'

const url = getURLobject(window.location)

const initialState = {
  mode: 'oneOff',
  oneOff: oneOff.state,
  repeat: repeatable.state,
  url: url
}

if (isStr(url.searchParams.mode)) {
  const mode = url.searchParams.mode.trim().substr(0, 6)
  if (mode === 'oneOff' || mode === 'repeat') {
    initialState.mode = mode
  }
}
console.log('initialState:', initialState)

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
