import { mainAppActions } from './main-app.state.actions.mjs'
import { urlActions } from '../url/url.state.all.mjs'

let loop = 0

export const mainAppMW = store => next => action => {
  switch (action.type) {
    case mainAppActions.SET_MODE:
      if (loop === 0) {
        const tmpMode = action.payload.toLowerCase()

        const mode = (tmpMode === 'oneoff')
          ? 'oneOff'
          : (tmpMode.substring(0, 6) === 'repeat')
              ? 'repeatable'
              : false

        if (mode !== false) {
          loop = 1
          store.dispatch({
            ...action,
            payload: mode
          })
          loop = 0
          return next({
            type: urlActions.UPDATE_GET,
            payload: {
              key: 'mode',
              value: mode
            }
          })
        }
      }
      break

    case mainAppActions.SET_OUTPUT:
      const _state = store.getState() // eslint-disable-line
      // By default repeatable actions replace the contents of the
      // input field. However when in debug mode the output of the
      // action should be put in the output field.
      // console.log('state:', _state)
      // console.log('state.mode:', _state.mode)
      // console.log('state.debug:', _state.debug)
      if (_state.mode === 'repeatable' && _state.debug === false) {
        return next({
          ...action,
          type: mainAppActions.SET_INPUT
        })
      }
      break
  }

  return next(action)
}
