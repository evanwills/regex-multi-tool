// import { createSlice } from '../../redux/redux-toolkit.mjs'
import {
  repeatActions,
  dispatchRegisterAction
} from './repeatable.state.actions.mjs'
import { repeatableReducer, defaultRepeat } from './repeatable.state.reducers.mjs'
import { repeatableMW } from './repeatable.state.middleware.mjs'

export const repeatable = {
  state: defaultRepeat,
  actions: repeatActions,
  reducers: repeatableReducer,
  middleware: repeatableMW,
  register: dispatchRegisterAction
}
