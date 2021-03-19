import { userSettingsActions } from './user-settings.state.actions.mjs'

export const initialUserSettingsState = {
  darkMode: true,
  debug: false,
  darkModeBg: '#2d2b2b',
  darkModeTxt: '#fff',
  fontSize: 1,
  lightModeBg: '#fff',
  lightModeTxt: '#2d2b2b',
  localStorage: false,
  settingsOpen: false
}

export const userSettingsReducer = (state = initialUserSettingsState, action) => {
  switch (action.type) {
    case userSettingsActions.TOGGLE_DARK_MODE:
      return {
        ...state,
        darkMode: !state.darkMode
      }

    case userSettingsActions.TOGGLE_DEBUG:
      return {
        ...state,
        debug: !state.debug
      }

    case userSettingsActions.TOGGLE_LOCAL_STORAGE:
      return {
        ...state,
        localStorage: !state.localStorage
      }

    case userSettingsActions.TOGGLE_SETTINGS_OPEN:
      return {
        ...state,
        settingsOpen: !state.settingsOpen
      }

    case userSettingsActions.SET_FONT_SIZE:
      return {
        ...state,
        fontSize: action.payload
      }

    case userSettingsActions.SET_DARK_MODE_BG:
      return {
        ...state,
        darkModeBg: action.payload
      }

    case userSettingsActions.SET_DARK_MODE_TXT:
      return {
        ...state,
        darkModeTxt: action.payload
      }

    case userSettingsActions.SET_LIGHT_MODE_BG:
      return {
        ...state,
        lightModeBg: action.payload
      }

    case userSettingsActions.SET_LIGHT_MODE_TXT:
      return {
        ...state,
        lightModeTxt: action.payload
      }
  }

  return state
}
