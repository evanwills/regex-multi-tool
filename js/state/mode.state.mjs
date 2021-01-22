
export const modeActions = {
  SET_MODE: 'MODE_SET_MODE'
}

export const modeReducer = (state = 'single', action = { type: 'default' }) => {
  if (action.type === modeActions.SET_MODE) {
    if (typeof action.payload === 'string' && state !== action.payload && (action.payload === 'single' || action.payload === 'repeat')) {
      return action.payload
    }
  } else {
    return state
  }
}
