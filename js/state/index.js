import { combineReducers, createStore } from 'redux'
import { modeReducer } from './mode.state.js'
// import { singleReducer } from './single.state.actions.js'
// import { singleReducer } from './single.state.middleware.js'
import { singleReducer } from './single.state.reducers.js'
import { repeatReducer } from './repeat.state.js'

const initialState = {
  mode: 'single',
  single: {
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
    single: singleReducer,
    repeat: repeatReducer
  }),
  initialState
)
