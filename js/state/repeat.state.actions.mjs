export const repeatActions = {
  REGISTER_SINGLE_ACTION: 'REPEATABLE_REGISTER_SINGLE_ACTION',
  REGISTER_ALL_ACTIONS: 'REPEATABLE_REGISTER_ALL_ACTIONS',
  REGISTER_GROUP: 'REPEATABLE_REGISTER_GROUP',
  SET_ACTION: 'REPEATABLE_SET_ACTON',
  UPDATE_FIELD: 'REPEATABLE_UPDATE_FIELD',
  MODIFY_INPUT: 'REPEATABLE_MODIFY_INPUT',
  RESET_ACTION: 'REPEATABLE_RESET_ACTION', // Only used by middleware
  TOGGLE_NAV: 'REPEATABLE_TOGGLE_NAV',
  TOGGLE_DEBUG: 'REPEATABLE_TOGGLE_DEBUG',
  ERROR: 'REPEATABLE_ERROR',
  INIT: 'REPEATABLE_INIT'
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

// export const getAutoDispatchRegisterAction = (_dispatch, _action) => {
//   return function (e) {
//     _dispatch({
//       type: repeatActions.REGISTER_ACTION,
//       payload: _action
//     })
//   }
// }

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
