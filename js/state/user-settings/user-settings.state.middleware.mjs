import { userSettingsActions } from './user-settings.state.actions.mjs'
import { urlActions } from '../url/url.state.all.mjs'
import { isInt, isStr } from '../../utility-functions.mjs'

const validColour = (colour) => (isStr(colour) && colour.match(/^#[0-9a-f]{3,6}$/i))

let loop = 0

export const userSettingsMW = store => next => action => {
  switch (action.type) {
    case userSettingsActions.SET_FONT_SIZE:
      if (isInt(action.payload) && action.payload >= 8 && action.payload <= 40) {
        return next({
          ...action,
          payload: (action.payload / 16)
        })
      } else {
        console.error('FONT-SIZE NOT UPDATED: Font size must be an integer between 8 and 32', action.payload)
      }
      break

    case userSettingsActions.TOGGLE_DEBUG:
      if (loop === 0) {
        loop += 1
        store.dispatch(action)
        loop = 0
        const state = store.getState()
        return next({
          type: urlActions.UPDATE_GET,
          payload: {
            key: 'debug',
            value: state.userSettings.debug
          }
        })
      } else {
        return next(action)
      }
      break

    case userSettingsActions.SET_CUSTOM_MODE_BG:
    case userSettingsActions.SET_CUSTOM_MODE_TXT:
    case userSettingsActions.SET_CUSTOM_MODE_OVER_COLOUR:
    case userSettingsActions.SET_CUSTOM_MODE_OVER_COLOUR_REV:
      if (validColour(action.payload)) {
        return next(action)
      } else {
        console.error(action.type + 'FAILED: invalid colour value', action.payload)
      }
  }
  return next(action)
}
