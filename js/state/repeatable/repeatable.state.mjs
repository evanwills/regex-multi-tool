// import { createSlice } from '../../redux/redux-toolkit.mjs'
import {
  repeatActions,
  getAutoDispatchSetAction,
  getAutoDispatchToggleDebug,
  getAutoDispatchToggleNav,
  getAutoDispatchModifyInput,
  getAutoDispatchUpdateField,
  dispatchRegisterAction
} from './repeatable.state.actions.mjs'
import { repeatableReducer } from './repeatable.state.reducers.mjs'
import { repeatableMW } from './repeatable.state.middleware.mjs'

const repeatableState = {
  // Complete list of all actions grouped by user group
  allActions: {},
  // Action currently being used
  activeAction: {},
  fields: {
    // The primary input field for repeatable actions
    // (Always plain text)
    inputPrimary: '',
    // Additional input fields (may be numbers or texts)
    // NOTE: Extra inputs contain everything about the extra input,
    //       not just it's current value
    inputExtra: [],
    // The primary output field
    // (the modified version of inputPrimary)
    outputPrimary: '',
    // It's sometimes useful to output the results of a repeatable
    // action into distinct blocks
    // (e.g. when creating both HTML for display to the user
    //       and HTML for an email)
    outputExtra: [],
    //
    groups: []
  },
  navOpen: false,
  debug: false
}

export const repeatable = {
  state: repeatableState,
  actions: repeatActions,
  reducers: repeatableReducer,
  middleware: repeatableMW,
  register: dispatchRegisterAction
}

export const getEventHandlers = (dispatch) => {
  return {
    setAction: getAutoDispatchSetAction(dispatch),
    toggleDebug: getAutoDispatchToggleDebug(dispatch),
    toggleNav: getAutoDispatchToggleNav(dispatch),
    modifyInput: getAutoDispatchModifyInput(dispatch),
    updateField: getAutoDispatchUpdateField(dispatch)
  }
}
