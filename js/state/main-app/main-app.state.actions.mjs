export const mainAppActions = {
  SET_MODE: 'MAIN-APP_SET_MODE',
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
      case 'replace':
        _type = mainAppActions.MODIFY
        break

      case 'test':
        _type = mainAppActions.TEST
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
