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

export const appState = createStore(
  {
    mode: modeReducer,
    single: {
      input: regexInputReducer,
      regex: {
        pairs: regexPairsReducer,
        chain: regexUpdateChainReducer,
        engine: regexSetEngineReducer,
        defaults: regexUpdateDefaultsReducer,
        engines: regexRegisterEngineReducer
      },
      matches: regexSetMatchesReducer,
      output: regexSetOutputReducer
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
  },
  initialState
)
