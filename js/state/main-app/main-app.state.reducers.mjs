import { isStr } from '../../utility-functions.mjs'
import { mainAppActions } from './main-app.state.actions.mjs'

export const modeReducer = (state = 'oneOff', action = { type: 'default' }) => {
  if (action.type === mainAppActions.SET_MODE) {
    if (typeof action.payload === 'string' && (action.payload === 'oneOff' || action.payload === 'repeatable')) {
      if (state !== action.payload) {
        return action.payload
      } else {
        console.warn('Regex Multi Tool is already set to "' + action.payload + '"')
      }
    } else {
      throw Error('Cannot set mode to "' + action.payload + '"')
    }
  }

  return state
}

export const groupsReducer = (state = '', action = { type: 'default' }) => {
  if (action.type === mainAppActions.SET_GROUPS) {
    if (isStr(action.payload) && state !== action.payload) {
      return action.payload
    } else {
      throw Error('Cannot set mode to "' + action.payload + '"')
    }
  }

  return state
}
