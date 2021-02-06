import { combineReducers, createStore } from 'redux'
import { modeReducer } from './mode.state.mjs'
// import { oneOffReducer } from './oneOff.state.actions.mjs'
// import { oneOffReducer } from './oneOff.state.middleware.mjs'
import { oneOffReducer } from './oneOff.state.reducers.mjs'
import { repeatReducer } from './repeat.state.reducers.mjs'

const initialState = {
  mode: 'oneOff',
  oneOff: {
    input: {
      raw: '',
      split: {
        doSplit: false,
        splitter: ''
      },
      strip: {
        before: false,
        after: false
      }
    },
    regex: {
      pairs: [],
      chain: true,
      engine: 'vanillaJS',
      defaults: {
        flags: 'ig',
        delims: {
          open: '',
          close: ''
        },
        multiLine: false,
        transformEscaped: true
      },
      engines: []
    },
    matches: [],
    output: ''
  },
  repeat: {
    actions: [],
    action: '',
    fields: {
      inputs: [],
      value: '',
      outputs: [],
      groups: []
    }
  }
}

export const store = createStore(
  combineReducers({
    mode: modeReducer,
    oneOff: oneOffReducer,
    repeat: repeatReducer
  }),
  initialState
)
