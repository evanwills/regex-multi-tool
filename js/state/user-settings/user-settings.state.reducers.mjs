import { userSettingsActions } from './user-settings.state.actions.mjs'

export const initialUserSettingsState = {
  uiMode: 'darkMode',
  debug: false,
  customBg: '#2d2b2b',
  customTxt: '#fff',
  customOver: '#000',
  customRev: '#fff',
  fontSize: 1,
  localStorage: false,
  settingsOpen: false
}

export const userSettingsReducer = (state = initialUserSettingsState, action) => {
  switch (action.type) {
    case userSettingsActions.SET_UI_MODE:
      return {
        ...state,
        uiMode: action.payload
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

    case userSettingsActions.SET_CUSTOM_MODE_BG:
      return {
        ...state,
        customBg: action.payload
      }

    case userSettingsActions.SET_CUSTOM_MODE_TXT:
      return {
        ...state,
        customTxt: action.payload
      }

    case userSettingsActions.SET_CUSTOM_MODE_OVER_COLOUR:
      return {
        ...state,
        customOver: action.payload
      }

    case userSettingsActions.SET_CUSTOM_MODE_OVER_COLOUR_REVERSE:
      return {
        ...state,
        customRev: action.payload
      }

    case userSettingsActions.RESTORE:
      const newState = { ...state } // eslint-disable-line
      let hasChanged = false // eslint-disable-line
      for (const key in action.payload) {
        // console.log('key:', key)
        // console.log('action.payload[' + key + ']:', action.payload[key])
        // console.log('state[' + key + ']:', state[key])
        if (typeof state[key] === typeof action.payload[key] && state[key] !== action.payload[key]) {
          hasChanged = true
          newState[key] = action.payload[key]
        }
      }
      return (hasChanged === true) ? newState : state
  }

  return state
}
