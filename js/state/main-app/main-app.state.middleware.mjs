import { mainAppActions } from './main-app.state.actions.mjs'
import { urlActions } from '../url/url.state.all.mjs'

let loop = 0

export const mainAppMW = store => next => action => {
  // const _state = store.getState()
  console.log('action:', action)
  switch (action.type) {
    case mainAppActions.SET_MODE:
      if (loop === 0) {
        loop += 1
        store.dispatch(action)
        loop = 0
        return next({
          type: urlActions.UPDATE_GET,
          payload: {
            key: 'mode',
            value: action.payload
          }
        })
      }
  }

  return next(action)
}
