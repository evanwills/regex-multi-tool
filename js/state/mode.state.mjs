
export const modeActions = {
  SET_MODE: 'MODE_SET_MODE'
}

export const modeReducer = (state = 'oneOff', action = { type: 'default' }) => {
  if (action.type === modeActions.SET_MODE) {
    if (typeof action.payload === 'string' && state !== action.payload && (action.payload === 'oneOff' || action.payload === 'repeat')) {
      return action.payload
    }
  } else {
    return state
  }
}
