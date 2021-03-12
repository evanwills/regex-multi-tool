import { combineReducers, createStore, applyMiddleware, compose } from '../redux/redux.mjs'
import { modeReducer } from './mode.state.mjs'
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
    applyMiddleware(oneOff.middleware),
    applyMiddleware(repeatable.middleware)
  )
)
