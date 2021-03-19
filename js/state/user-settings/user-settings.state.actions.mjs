// import { getMeta } from '../../utility-functions.mjs'

export const userSettingsActions = {
  TOGGLE_DEBUG: 'USER_SETTINGS_TOGGLE_DEBUG',
  TOGGLE_DARK_MODE: 'USER_SETTINGS_TOGGLE_DARK_MODE',
  TOGGLE_LOCAL_STORAGE: 'USER_SETTINGS_TOGGLE_LOCAL_STORAGE',
  TOGGLE_SETTINGS_OPEN: 'USER_SETTINGS_TOGGLE_SETTINGS_OPEN',
  SET_FONT_SIZE: 'USER_SETTINGS_SET_FONT_SIZE',
  SET_DARK_MODE_BG: 'USER_SETTINGS_SET_DARK_MODE_BG',
  SET_DARK_MODE_TXT: 'USER_SETTINGS_SET_DARK_MODE_TXT',
  SET_LIGHT_MODE_BG: 'USER_SETTINGS_SET_LIGHT_MODE_BG',
  SET_LIGHT_MODE_TXT: 'USER_SETTINGS_SET_LIGHT_MODE_TXT'
}

export const getAutoDipatchSettingsSimpleEvent = (_dispatch) => {
  return function (e) {
    let _type = ''
    switch (this.value) {
      case 'debug':
        _type = userSettingsActions.TOGGLE_DEBUG
        break

      case 'darkMode':
        _type = userSettingsActions.TOGGLE_DARK_MODE
        break

      case 'localStorage':
        _type = userSettingsActions.TOGGLE_LOCAL_STORAGE
        break

      case 'user-settings-toggleSettings-open':
      case 'user-settings-toggleSettings-close':
        _type = userSettingsActions.TOGGLE_SETTINGS_OPEN
        break
    }

    if (_type !== '') {
      _dispatch({
        type: _type
      })
    }
  }
}

export const getAutoDipatchSettingsValueEvent = (_dispatch) => {
  return function (e) {
    let _type = ''

    switch (this.id) {
      case 'set-fontSize':
        _type = userSettingsActions.SET_FONT_SIZE
        break

      case 'set-darkMode-bg':
        _type = userSettingsActions.SET_DARK_MODE_BG
        break

      case 'set-darkMode-txt':
        _type = userSettingsActions.SET_DARK_MODE_TXT
        break

      case 'set-lightMode-bg':
        _type = userSettingsActions.SET_LIGHT_MODE_BG
        break

      case 'set-lightMode-txt':
        _type = userSettingsActions.SET_LIGHT_MODE_TXT
        break
    }

    if (_type !== '') {
      _dispatch({
        type: _type,
        payload: this.value
      })
    }
  }
}
