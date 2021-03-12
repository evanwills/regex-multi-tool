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

const initialState = {
  mode: 'oneOff',
  oneOff: oneOff.state,
  repeat: repeatable.state
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
