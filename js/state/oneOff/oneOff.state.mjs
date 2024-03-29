// import { createSlice } from '../../redux/redux-toolkit.mjs'
import {
  regexPairActions,
  oneOffActions,
  getAutoDispatchOneOffPairSimpleEvent,
  getAutoDispatchOneOffPairValueEvent,
  getAutoDipatchOneOffSimpleEvent,
  getAutoDispatchOneOffValueEvent,
  registerOneOffEngine,
  getAutoDipatchOneOffTabClick
} from './oneOff.state.actions.mjs'
import { oneOffReducer, getDefaultPair } from './oneOff.state.reducers.mjs'
import { oneOffMW } from './oneOff.state.middleware.mjs'

const defaultPair = getDefaultPair()

const oneOffState = {
  input: {
    raw: '',
    split: {
      doSplit: false,
      splitter: '\\n'
    },
    strip: {
      before: false,
      after: false
    },
    settingsOpen: false
  },
  regex: {
    pairs: [defaultPair],
    focusedID: defaultPair.id,
    chain: true,
    engine: 'VanillaJS',
    defaults: {
      flags: 'ig',
      delims: {
        open: '',
        close: ''
      },
      multiLine: false,
      fullWidth: true,
      transformEscaped: true
    },
    engines: []
  },
  matches: [],
  output: '',
  screen: 'input'
}

export const oneOff = {
  state: oneOffState,
  actions: {
    pairs: regexPairActions,
    general: oneOffActions
  },
  register: registerOneOffEngine,
  reducers: oneOffReducer,
  middleware: oneOffMW
}
