import { repeatActions } from './repeatable.state.actions.mjs'
import { repeatable } from '../../repeatable/repeatable-init.mjs'
import {
  isNumeric,
  isStr,
  isNumber,
  isBool
  // invalidString,
  // isFunction,
  // getURLobject
} from '../../utility-functions.mjs'

// export const repeatActions = {
//   REGISTER_ALL_ACTIONS: 'REPEATABLE_REGISTER_ALL_ACTIONS',
//   REGISTER_SINGLE_ACTION: 'REPEATABLE_REGISTER_SINGLE_ACTION',
//   REGISTER_GROUP: 'REPEATABLE_REGISTER_GROUP',
//   SET_ACTION: 'REPEATABLE_SET_ACTON',
//   UPDATE_FIELD: 'REPEATABLE_UPDATE_FIELD',
//   MODIFY_INPUT: 'REPEATABLE_MODIFY_INPUT',
//   RESET_ACTION: 'REPEATABLE_RESET_ACTION', // Only used by middleware
//   TOGGLE_NAV: 'REPEATABLE_TOGGLE_NAV',
//   TOGGLE_DEBUG: 'REPEATABLE_TOGGLE_DEBUG',
//   ERROR: 'REPEATABLE_ERROR',
//   INIT: 'REPEATABLE_INIT'
// }

export const modifyInput = ({ getState, dispatch }) => next => action => {
}

/**
 * Convert Redux state for (repeatable) extra inputs to an object
 * with the same keys but the value is a function that returns the
 * value for the origin key
 *
 * @param {object} inputs
 *
 * @returns {object}
 */
const convertInputsToFunctions = (inputs) => {
  const output = {}
  for (const key in inputs) {
    const val = inputs[key]
    if (isStr(val) || isNumber(val) || isBool(val)) {
      output[key] = () => val
    } else {
      output[key] = (id) => {
        if (typeof val[id] === 'boolean') {
          return val[id]
        } else {
          throw Error(key + '() expects input to be one of the following IDs: "' + Object.keys(val).join('", "') + '"')
        }
      }
    }
  }
}

const getActionMeta = (allActions, actionID) => {
  for (const prop in allActions) {
    const action = allActions[prop].filter(_action => _action.id === actionID)
    if (action.length === 1) {
      return action
    }
  }
  return false
}

export const repeatableMW = store => next => action => {
  const _state = store.getState()

  switch (action.type) {
    case repeatActions.INIT:
      return next({
        ...action,
        payload: repeatable.getActionsList()
      })

    case repeatActions.SET_ACTION:
      if (repeatable.setAction(action.payload)) {
        return next({
          ...action,
          payload: getActionMeta(
            _state.repeat.allActions,
            action.payload
          )
        })
      } else {
        return next({
          type: repeatActions.ERROR,
          payload: 'Could not set action "' + action.payload + '"'
        })
      }

    case repeatActions.UPDATE_FIELD:
      if (action.payload.id !== 'input') {
        // Lets see what type of field this is and ensure that
        // the value going into the store is the correct type.
        const field = _state.fields.inputExtra.filter(_field => _field.id === action.payload.id)

        if (field[0].type === 'number') {
          if (isNumeric(action.payload.value)) {
            return next({
              ...action,
              payload: {
                ...action.payload,
                value: (action.payload * 1)
              }
            })
          }
        }
      }
      return next(action)

    case repeatActions.MODIFY_INPUT:
      if (_state.repeat.activeAction.remote === true) {
        // This needs to be a fetch request to the host server
        return next(action)
      } else {
        return next(repeatable.run(
          _state.repeat.fields.inputPrimary,
          convertInputsToFunctions(_state.repeat.fields.inputExtra)
        ))
      }

    default:
      return next(action)
  }
}
