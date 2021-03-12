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
import { oneOffReducer, getDefaultPair } from './oneOff.state.reducers.mjs'
import { oneOffMW } from './oneOff.state.middleware.mjs'

const defaultPair = getDefaultPair()

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
    pairs: [defaultPair],
    focusedID: defaultPair.id,
    chain: true,
    engine: 'vanillaJS',
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
  output: ''
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

export const getEventHandlers = (dispatch) => {
  return {
    simplePair: getAutoDispatchOneOffPairSimpleEvent(dispatch),
    pairValue: getAutoDispatchOneOffPairValueEvent(dispatch),
    simpleGeneral: getAutoDipatchOneOffSimpleEvent(dispatch),
    generalValue: getAutoDispatchOneOffValueEvent(dispatch),
  }
}
