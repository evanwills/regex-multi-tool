// import { createSlice } from '../../redux/redux-toolkit.mjs'
import {
  regexPairActions,
  oneOffActions,
  getAutoDispatchOneOffPairSimpleEvent,
  getAutoDispatchOneOffPairValueEvent,
  getAutoDipatchOneOffSimpleEvent,
  getAutoDispatchOneOffValueEvent,
  registerOneOffEngine
} from './oneOff.state.actions.mjs'
import { oneOffReducer } from './oneOff.state.reducers.mjs'
import { oneOffMW } from './oneOff.state.middleware.mjs'


const oneOffState = {
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
    focusedID: '',
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
}

export const oneOff = {
  state: oneOffState,
  actions: {
    pairs: regexPairActions,
    general: oneOffActions
  },
  event: {
    simplePair: getAutoDispatchOneOffPairSimpleEvent,
    pairValue: getAutoDispatchOneOffPairValueEvent,
    simpleGeneral: getAutoDipatchOneOffSimpleEvent,
    generalValue: getAutoDispatchOneOffValueEvent,
    register: registerOneOffEngine
  },
  reducers: oneOffReducer,
  middleware: oneOffMW
}

