import { repeatActions } from './repeat.state.actions.mjs'

/**
 * Initial State for repeatable actions in Regex Multi-Tool
 *
 * @constant {object} defaultRepeat
 */
const defaultRepeat = {
  // Complete list of all actions grouped by user group
  allActions: {},
  // Action currently being used
  activeAction: {},
  fields: {
    // The primary input field for repeatable actions
    // (Always plain text)
    inputPrimary: '',
    // Additional input fields (may be numbers or texts)
    // NOTE: Extra inputs contain everything about the extra input,
    //       not just it's current value
    inputExtra: [],
    // The primary output field
    // (the modified version of inputPrimary)
    outputPrimary: '',
    // It's sometimes useful to output the results of a repeatable
    // action into distinct blocks
    // (e.g. when creating both a HTML for display to the user
    //       and HTML for an email)
    outputExtra: [],
    //
    groups: []
  },
  navOpen: false,
  debug: false
}

/**
 * Group and sort action list
 *
 * @param {array} actionsList List of all actions available to user
 *
 * @returns {object}
 */
const sortActionsList = (actionsList) => {
  // const _newList = []
  const groupedActions = {}
  const publicActions = []

  const sortByActionLabel = (a, b) => {
    if (a.label < b.label) {
      return -1
    } else if (a.label > b.label) {
      return 1
    }
    return 0
  }

  // Get group names
  const groupList = actionsList.map(action => action.group)
  groupList.sort()
  for (let a = 0; a < groupList; a += 1) {
    if (groupList[a] !== 'public') {
      groupedActions[groupList[a]] = []
    }
  }

  // Add actions to groups
  for (let a = 0; a < actionsList; a += 1) {
    const prop = actionsList[a].group
    if (prop === 'public') {
      publicActions.push(actionsList[a])
    } else {
      groupedActions[prop].push(actionsList[a])
    }
  }

  // Sort actions within a group
  for (const prop in groupedActions) {
    groupedActions[prop].sort(sortByActionLabel)
  }

  // Put public actions at the bottom of the list
  publicActions.sort(sortByActionLabel)
  groupedActions.public = publicActions

  return groupedActions
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

export const repeatableReducer = (state = defaultRepeat, action = { type: 'default' }) => {
  switch (action.type) {
    case repeatActions.SET_ACTION:
      return (action.payload !== false)
        ? {
            ...state,
            currentAction: action.payload,
            fields: {
              inputLabel: action.payload.inputLabel,
              inputPrimary: '',
              inputExtra: action.payload.extraInputs,
              outputLabel: action.payload.outputLabel,
              outputPrimary: '',
              outputExtra: [],
              groups: []
            }
          }
        : state

    case repeatActions.REGISTER_ALL_ACTION:
      return {
        ...state,
        allActions: sortActionsList(action.payload)
      }

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

    case repeatActions.REPEATABLE_TOGGLE_NAV:
      return {
        ...state,
        navOpen: !state.navOpen
      }

    case repeatActions.REPEATABLE_TOGGLE_DEBUG:
      return {
        ...state,
        debug: !state.debug
      }

    default:
      return state
  }
}
