import { mainAppActions } from './main-app.state.actions.mjs'


export const modeReducer = (state = 'oneOff', action = { type: 'default' }) => {
  console.log('state:', state)
  console.log('action:', action)
  if (action.type === mainAppActions.SET_MODE) {
    if (typeof action.payload === 'string' && state !== action.payload && (action.payload === 'oneOff' || action.payload === 'repeatable')) {
      return action.payload
    } else {
      throw Error('Cannot set mode to "' + action.payload + '"')
    }
  }

  return state
}
