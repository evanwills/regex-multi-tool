import { combineReducers, createStore } from '../redux/redux.mjs'
import { modeReducer } from './mode.state.mjs'
// import { oneOffReducer } from './oneOff.state.actions.mjs'
// import { oneOffReducer } from './oneOff.state.middleware.mjs'
import { oneOffReducer } from './oneOff.state.reducers.mjs'
import { oneOffMW, finaliseOutputMW } from './oneOff.state.middleware.mjs'
import { repeatReducer } from './repeat.state.reducers.mjs'
import { modifyInput, repeatableMW,  } from './repeat.state.middleware.mjs'

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
