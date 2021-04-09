import { isStr } from '../../utilities/validation.mjs'
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

const baseReducer = (state, action, target) => {
  return (action.type === target && isStr(action.payload) && state !== action.payload)
    ? action.payload
    : state
}

export const groupsReducer = (state = '', action = { type: 'default' }) => {
  return baseReducer(
    state,
    action,
    mainAppActions.SET_GROUPS
  )
}

export const inputReducer = (state = '', action = { type: 'default' }) => {
  return baseReducer(
    state,
    action,
    mainAppActions.SET_INPUT
  )
}

export const outputReducer = (state = '', action = { type: 'default' }) => {
  return baseReducer(
    state,
    action,
    mainAppActions.SET_OUTPUT
  )
}

export const debugReducer = (state = false, action = { type: 'default' }) => {
  if (action.type === mainAppActions.TOGGLE_DEBUG) {
    return !state
  }
  return state
}
