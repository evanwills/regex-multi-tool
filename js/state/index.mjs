import { createStore, combineReducers } from './redux/redux.mjs'
import { modeReducer } from './mode.state.mjs'
import {
  regexInputReducer,
  regexPairsReducer,
  regexUpdateChainReducer,
  regexSetEngineReducer,
  regexUpdateDefaultsReducer,
  regexRegisterEngineReducer,
  regexSetMatchesReducer,
  regexSetOutputReducer
} from './single.state.mjs'
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
    single: {
      input: regexInputReducer(state.single.input, action),
      regex: {
        pairs: regexPairsReducer(state.single.regex.pairs, action),
        chain: regexUpdateChainReducer(state.single.regex.chain, action),
        engine: regexSetEngineReducer(state.single.regex.engine, action),
        defaults: regexUpdateDefaultsReducer(state.single.regex.defaults, action),
        engines: regexRegisterEngineReducer(state.single.regex.engines, action)
      },
      matches: regexSetMatchesReducer(state.single.matches, action),
      output: regexSetOutputReducer(state.single.output, action)
    },
    repeat: repeatReducer(state.repeat, action)
  }
}
