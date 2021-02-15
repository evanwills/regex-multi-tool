import { repeatActions } from './repeat.state.actions.mjs'

const defaultRepeat = {
  actions: [],
  actionID: '',
  fields: {
    inputs: [],
    value: '',
    outputs: [],
    groups: []
  },
  navOpen: false,
  debug: false
}

/**
 * Check whether an action matching the specified ID is regestered
 *
 * @param {array}  objectList List of registered actions
 * @param {string} id         ID of action to be matched
 *
 * @returns {boolean} TRUE if action matching supplied ID is
 *                    registered. FALSE otherwise
 */
const objectExistsInList = (objectList, id) => {
  for (let a = 0; a < objectList.length; a += 1) {
    if (objectList[a].id === id) {
      return true
    }
  }
  return false
}

/**
 * Check whether a field should update.
 *
 * @param {array}         fields List of all fields that could be updated
 * @param {string}        id     ID of the specific field to be updated
 * @param {string,number} value  New value for that field
 *
 * @returns {boolean} TRUE if field exists and current field value
 *                    does NOT match supplied value. FALSE otherwise.
 */
const fieldShouldUpdate = (fields, id, value) => {
  for (let a = 0; a < fields.length; a += 1) {
    if (fields[a].id === id && fields[a].value !== value) {
      return true
    }
  }
  return false
}

export const repeatReducer = (state = defaultRepeat, action = { type: 'default' }) => {
  switch (action.type) {
    case repeatActions.SET_ACTION:
      return (objectExistsInList(state.actions, action.payload) === true)
        ? { ...state, actionID: action.payload.id }
        : state

    case repeatActions.REGISTER_ACTION:
      return (objectExistsInList(state.actions, action.payload) === false)
        ? { ...state, actions: [...state.actions, action.payload] }
        : state

    case repeatActions.UPDATE_FIELD:
      return {
        ...state,
        fields: {
          ...state.fields,
          inputs: state.fields.inputs.map((field) => {
            if (field.id === action.payload.id) {
              return {
                ...field,
                value: action.payload.value
              }
            } else {
              return field
            }
          })
        }
      }

    case repeatActions.MODIFY_INPUT:
      if (typeof action.payload === 'string') {
        return (state.fields.value !== action.payload)
          ? { ...state, fields: { ...state.fields, value: action.payload } }
          : state
      } else if (fieldShouldUpdate(state.fields.outputs, action.payload.id, action.payload.value)) {
        return {
          ...state,
          outputs: state.outputs.map((output) => {
            return (output.id === action.payload.id) ? { ...output, value: action.payload.value } : output
          })
        }
      } else {
        return state
      }

    case repeatActions.REGISTER_GROUP:
      return (objectExistsInList(state.fields.groups, action.payload.id) === false)
        ? { ...state, fields: { ...state.fields, groups: action.payload } }
        : state

    case repeatActions.REPEAT_TOGGLE_NAV:
      return {
        ...state,
        navOpen: !state.navOpen
      }

    case repeatActions.REPEAT_TOGGLE_DEBUG:
      return {
        ...state,
        debug: !state.debug
      }

    default:
      return state
  }
}
