import { getMeta } from '../../utility-functions.mjs'

export const userSettingsActions = {
  TOGGLE_DEBUG: 'USER_SETTINGS_TOGGLE_DEBUG',
  TOGGLE_LOCAL_STORAGE: 'USER_SETTINGS_TOGGLE_LOCAL_STORAGE',
  TOGGLE_SETTINGS_OPEN: 'USER_SETTINGS_TOGGLE_SETTINGS_OPEN',
  SET_UI_MODE: 'USER_SETTINGS_SET_UI_MODE',
  SET_FONT_SIZE: 'USER_SETTINGS_SET_FONT_SIZE',
  SET_CUSTOM_MODE_BG: 'USER_SETTINGS_SET_CUSTOM_MODE_BG',
  SET_CUSTOM_MODE_TXT: 'USER_SETTINGS_SET_CUSTOM_MODE_TXT',
  SET_CUSTOM_MODE_OVER_COLOUR: 'USER_SETTINGS_SET_CUSTOM_MODE_OVER_COLOUR',
  SET_CUSTOM_MODE_OVER_COLOUR_REVERSE: 'USER_SETTINGS_SET_CUSTOM_MODE_OVER_COLOUR_REVERSE',
  RESTORE: 'USER_SETTINGS_RESTORE'
}

export const getAutoDipatchSettingsSimpleEvent = (_dispatch) => {
  return function (e) {
    let _type = ''

    switch (this.value) {
      case 'debugMode':
        _type = userSettingsActions.TOGGLE_DEBUG
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
    const meta = getMeta(this.id)
    const modes = ['darkMode', 'lightMode', 'customMode']
    let _type = ''

    switch (meta.type) {
      case 'fontSize':
        _type = userSettingsActions.SET_FONT_SIZE
        break

      case 'mode':
        if (modes.indexOf(this.value) > -1) {
          _type = userSettingsActions.SET_UI_MODE
        }
        break

      case 'customMode':
        switch (meta.extra) {
          case 'bg':
            _type = userSettingsActions.SET_CUSTOM_MODE_BG
            break

          case 'txt':
            _type = userSettingsActions.SET_CUSTOM_MODE_TXT
            break

          case 'over':
            _type = userSettingsActions.SET_CUSTOM_MODE_OVER_COLOUR
            break

          case 'rev':
            _type = userSettingsActions.SET_CUSTOM_MODE_OVER_COLOUR_REVERSE
            break
        }
    }

    if (_type !== '') {
      _dispatch({
        type: _type,
        payload: this.value
      })
    }
  }
}
