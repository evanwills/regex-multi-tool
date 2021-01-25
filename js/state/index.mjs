import { createStore, combineReducers } from './redux/redux.mjs'
import { modeReducer } from './mode.state.mjs'
import { singleReducer } from './single.state.mjs'
import { repeatReducer } from './repeat.state.mjs'

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

export const appReducer = (state, action) => {
  return {
    mode: modeReducer(state.mode, action),
    single: singleReducer(state.single, action),
    repeat: repeatReducer(state.repeat, action)
  }
}
