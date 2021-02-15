export const repeatActions = {
  REGISTER_ACTION: 'REPEAT_REGISTER_ACTION',
  REGISTER_GROUP: 'REPEAT_REGISTER_GROUP',
  SET_ACTION: 'REPEAT_SET_ACTON',
  UPDATE_FIELD: 'REPEAT_UPDATE_FIELD',
  MODIFY_INPUT: 'REPEAT_MODIFY_INPUT',
  RESET_ACTION: 'REPEAT_RESET_ACTION', // Only used by middleware
  TOGGLE_NAV: 'REPEAT_TOGGLE_NAV',
  TOGGLE_DEBUG: 'REPEAT_TOGGLE_DEBUG'
}

export const getAutoDispatchSetAction = (_dispatch) => {
  return function (e) {
    _dispatch({
      type: repeatActions.SET_ACTION,
      payload: this.dataset.id
    })
  }
}

export const getAutoDispatchToggleDebug = (_dispatch) => {
  return function (e) {
    _dispatch({
      type: repeatActions.TOGGLE_DEBUG
    })
  }
}

export const getAutoDispatchToggleNav = (_dispatch) => {
  return function (e) {
    _dispatch({
      type: repeatActions.TOGGLE_NAV
    })
  }
}

export const getAutoDispatchModifyInput = (_dispatch) => {
  return function (e) {
    _dispatch({
      type: repeatActions.MODIFY_INPUT
    })
  }
}

export const getAutoDispatchRegisterAction = (_dispatch, _action) => {
  return function (e) {
    _dispatch({
      type: repeatActions.REGISTER_ACTION,
      payload: _action
    })
  }
}

export const getAutoDispatchUpdateField = (_dispatch) => {
  return function (e) {
    _dispatch({
      type: repeatActions.UPDATE_FIELD,
      payload: {
        id: this.id,
        value: this.value
      }
    })
  }
}
