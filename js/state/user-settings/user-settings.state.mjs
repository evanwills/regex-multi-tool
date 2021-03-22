import {
  userSettingsActions,
  getAutoDipatchSettingsSimpleEvent,
  getAutoDipatchSettingsValueEvent
} from './user-settings.state.actions.mjs'
import {
  initialUserSettingsState,
  userSettingsReducer
} from './user-settings.state.reducers.mjs'
import { userSettingsMW } from './user-settings.state.middleware.mjs'

export const userSettings = {
  state: initialUserSettingsState,
  actions: userSettingsActions,
  reducer: userSettingsReducer,
  middleware: userSettingsMW
}

export const getUIEventHandlers = (dispatch) => {
  return {
    simpleEvent: getAutoDipatchSettingsSimpleEvent(dispatch),
    valueEvent: getAutoDipatchSettingsValueEvent(dispatch)
  }
}
