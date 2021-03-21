import { mainAppActions } from './main-app.state.actions.mjs'
import { urlActions } from '../url/url.state.all.mjs'

export const mainAppMW = store => next => action => {
  // const _state = store.getState()
  console.log('action:', action)
  switch (action.type) {
    case mainAppActions.SET_MODE:
      store.dispatch({
        type: urlActions.UPDATE_GET,
        payload: {
          key: 'mode',
          value: action.payload
        }
      })
  }

  return next(action)
}
