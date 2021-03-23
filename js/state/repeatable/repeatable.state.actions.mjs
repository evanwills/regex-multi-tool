import { isNonEmptyStr } from '../../utility-functions.mjs'

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

export const getAutoDispatchHrefAction = (_dispatch) => {
  return function (e) {
    e.preventDefault()
    let _action = this.href.replace(/^.*?[?&]action=([^&#]+)(?:[&#].*?)?$/i, '$1')

    if (_action !== this.href) {
      _dispatch({
        type: repeatActions.SET_ACTION,
        payload: _action
      })
    } else {
      console.warn('Could not determin the action to be set')
    }
  }
}

export const getAutoDispatchSimpleAction = (_dispatch) => {
  return function (e) {
    let _type = ''

    switch (this.value) {
      case 'toggle-nav':
        _type = repeatActions.TOGGLE_NAV
        break
    }

    _dispatch({
      type: _type
    })
  }
}

export const getAutoDispatchValueAction = (_dispatch) => {
  return function (e) {
    let _type = ''

    switch (this.id) {
    }

    _dispatch({
      type: _type,
      payload: this.value
    })
  }
}


/**
 *
 * @param _dispatch
 * @returns
 */
export const dispatchRegisterAction = (_dispatch, repeatable, actionID) => {
  const aType = (Array.isArray(repeatable))
    ? repeatActions.REGISTER_ALL_ACTIONS
    : repeatActions.REGISTER_SINGLE_ACTION

  _dispatch({
    type: aType,
    payload: repeatable
  })

  if (isNonEmptyStr(actionID)) {
    _dispatch({
      type: repeatActions.SET_ACTION,
      payload: actionID
    })
  }
}

export const getRepeatableEventHandlers = (dispatch) => {
  return {
    hrefEvent: getAutoDispatchHrefAction(dispatch),
    simpleEvent: getAutoDispatchSimpleAction(dispatch),
    valueEvent: getAutoDispatchValueAction(dispatch),
  }
}
