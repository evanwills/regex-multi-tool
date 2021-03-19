import { userSettingsActions } from './user-settings.state.actions.mjs'
import { isInt, isStr } from '../../utility-functions.mjs'

const validColour = (colour) => (isStr(colour) && colour.match(/^#[0-9a-f]{6}$/i))

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

    case userSettingsActions.SET_DARK_MODE_BG:
    case userSettingsActions.SET_DARK_MODE_TXT:
    case userSettingsActions.SET_LIGHT_MODE_BG:
    case userSettingsActions.SET_LIGHT_MODE_TXT:
      if (validColour(action.payload)) {
        return next(action)
      } else {
        console.error(action.type + 'FAILED: invalid colour value', action.payload)
      }
  }
  return next(action)
}
