import { repeatActions } from '../repeatable/repeatable.state.actions.mjs'
import { oneOffActions } from '../oneOff/oneOff.state.actions.mjs'

export const mainAppActions = {
  SET_MODE: 'MAIN-APP_SET_MODE',
  SET_GROUPS: 'MAIN-APP_SET_GROUPS',
  MODIFY: 'MAIN-APP_MODIFY',
  TEST: 'MAIN-APP_TEST',
  RESET: 'MAIN-APP_RESET',
  HELP: 'MAIN-APP_HELP'
}

export const getAutoDispatchMainAppEvent = (_dispatch) => {
  return function (e) {
    let _type = 'default'
    switch (this.value.toLowerCase()) {
      case 'oneoff':
      case 'repeatable':
        _dispatch({
          type: mainAppActions.SET_MODE,
          payload: this.value
        })
        return

      case 'modify':
        _type = repeatActions.MODIFY_INPUT
        break

      case 'replace':
        _type = oneOffActions.SET_OUTPUT
        break

      case 'test':
        _type = oneOffActions.SET_MATCHES
        break

      case 'reset':
        _type = mainAppActions.RESET
        break

      case 'help':
        _type = mainAppActions.HELP
        break
    }

    _dispatch({ type: _type })
  }
}
