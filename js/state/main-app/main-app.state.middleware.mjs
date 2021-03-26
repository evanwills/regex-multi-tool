import { mainAppActions } from './main-app.state.actions.mjs'
import { urlActions } from '../url/url.state.all.mjs'
import { repeatActions } from '../repeatable/repeatable.state.actions.mjs'

let loop = 0

export const mainAppMW = store => next => action => {
  switch (action.type) {
    case mainAppActions.SET_MODE:
      if (loop === 0) {
        loop = 1
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
