import { getMeta } from '../../utilities/sanitise.mjs'
import { isNonEmptyStr } from '../../utilities/validation.mjs'

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
    const _action = this.href.replace(/^.*?[?&]action=([^&#]+)(?:[&#].*?)?$/i, '$1')

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
    // console.group('inside getAutoDispatchSimpleAction()')
    // console.log('this:', this)
    // console.log('this.value:', this.value)
    // console.log('this.id:', this.id)
    // console.groupEnd()

    switch (this.value) {
      case 'toggle-nav':
        _type = repeatActions.TOGGLE_NAV
        break
    }

    if (_type !== '') {
      _dispatch({
        type: _type
      })
    }
  }
}

export const getAutoDispatchValueAction = (_dispatch) => {
  return function (e) {
    const meta = getMeta(this.id)
    // let _type = ''

    // console.group('getAutoDispatchValueAction()')
    // console.log('meta:', meta)
    // console.log('this:', this)
    // console.log('this.checked:', this.checked)

    switch (meta.type) {
      case 'extraInputs':
        // console.log('this.value:', this.value)
        _dispatch({
          type: repeatActions.UPDATE_FIELD,
          payload: {
            id: 'extraInputs',
            key: meta.extra,
            value: this.value,
            action: meta.id
          }
        })
        break

      case 'primaryInput':
        _dispatch({
          type: repeatActions.UPDATE_FIELD,
          payload: {
            id: 'input',
            key: '',
            value: this.value
          }
        })
        break
    }

    // if (_type !== '') {
    //   _dispatch({
    //     type: _type,
    //     payload: this.value
    //   })
    // }
    // console.groupEnd()
  }
}

/**
 *
 * @param _dispatch
 * @returns
 */
export const dispatchRegisterAction = (_dispatch, repeatable, actionID) => {
  const _type = (Array.isArray(repeatable))
    ? repeatActions.REGISTER_ALL_ACTIONS
    : repeatActions.REGISTER_SINGLE_ACTION

  // console.log('repeatable:', repeatable)
  // console.log('actionID:', actionID)
  _dispatch({
    type: _type,
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
    valueEvent: getAutoDispatchValueAction(dispatch)
  }
}
