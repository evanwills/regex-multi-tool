import {
  invalidStrNum,
  isBool,
  isBoolTrue,
  isNumeric,
  isStr
} from '../../utilities/validation.mjs'
import {
  makeAttributeSafe
} from '../../utilities/sanitise.mjs'
import { repeatActions } from './repeatable.state.actions.mjs'

/**
 * Initial State for repeatable actions in Regex Multi-Tool
 *
 * @constant {object} defaultRepeat
 */
export const defaultRepeat = {
  // Complete list of all actions grouped by user group
  allActions: {},
  // Action currently being used
  activeAction: {},
  // Additional input fields (may be numbers or texts)
  // NOTE: Extra inputs contain everything about the extra input,
  //       not just it's current value
  extraInputs: {},
  // It's sometimes useful to output the results of a repeatable
  // action into distinct blocks
  // (e.g. when creating both a HTML for display to the user
  //       and HTML for an email)
  extraOutputs: [],
  // Search string for filtering available actions.
  filter: '',
  actionsCount: 0,
  navOpen: false
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
    if (a.name < b.name) {
      return -1
    } else if (a.name > b.name) {
      return 1
    }
    return 0
  }

  // Get group names
  const groupList = actionsList.map(action => action.group)
  groupList.sort()
  for (let a = 0; a < groupList.length; a += 1) {
    if (typeof groupedActions[groupList[a]] === 'undefined' && groupList[a] !== 'public') {
      groupedActions[groupList[a]] = []
    }
  }

  // Add actions to groups
  for (let a = 0; a < actionsList.length; a += 1) {
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

  const output = []

  for (const prop in groupedActions) {
    output.push({
      name: prop,
      actions: groupedActions[prop]
    })
  }

  return output
}

// /**
//  * Check whether an action matching the specified ID is regestered
//  *
//  * @param {array}  objectList List of registered actions
//  * @param {string} id         ID of action to be matched
//  *
//  * @returns {boolean} TRUE if action matching supplied ID is
//  *                    registered. FALSE otherwise
//  */
// const objectExistsInList = (objectList, id) => {
//   for (let a = 0; a < objectList.length; a += 1) {
//     if (objectList[a].id === id) {
//       return true
//     }
//   }
//   return false
// }

/**
 * Get object whose keys match the list of extra IDs for extra input
 * fields and whose value match either the defaults set when the
 * action was registered or values set via GET variables
 *
 * @param {array}  extraInputs List of extra input fields as defined
 *                             when the action was registered
 * @param {object} get         key/value pairs from the URL's search
 *                             parameters (aka GET variables)
 *
 * @returns {object} List of key/value pairs with the initial value
 *                   for each extraInput field
 */
const getExtraInputKeyValues = (extraInputs, get) => {
  const output = {}
  for (const field in extraInputs) {
    const _field = extraInputs[field]
    const _get = (!invalidStrNum(_field.id, get)) ? get[_field.id] : ''
    switch (_field.type) {
      case 'text':
      case 'textarea':
        if (_get !== '') {
          output[_field.id] = _get
        } else if (!invalidStrNum('default', _field)) {
          output[_field.id] = _field.default
        } else {
          output[_field.id] = ''
        }
        break

      case 'number':
        if (_get !== '') {
          output[_field.id] = _get * 1
        } else if (!isNumeric(_field.default)) {
          output[_field.id] = _field.default * 1
        } else {
          output[_field.id] = ''
        }
        break

      case 'radio':
      case 'select':
        if (_get !== '') {
          output[_field.id] = _get
        } else {
          const defaultValue = _field.options.filter(option => isBoolTrue(option.default)).map(option => option.value)
          output[_field.id] = (defaultValue.length > 0)
            ? defaultValue[0]
            : ''
        }
        break

      case 'checkbox':
        const checkBoxes = {} // eslint-disable-line
        for (const box in _field.options) {
          const _box = _field.options[box]
          // need to make value work as GET variable
          const getKey = makeAttributeSafe(_field.id + '-' + _box.value)
          checkBoxes[_box.value] = (isBool(get[getKey]))
            ? get[getKey]
            : isBoolTrue(_box.default)
        }
        output[_field.id] = checkBoxes
        break
    }
  }
  return output
}

// /**
//  * Check whether a field should update.
//  *
//  * @param {array}         fields List of all fields that could be updated
//  * @param {string}        id     ID of the specific field to be updated
//  * @param {string,number} value  New value for that field
//  *
//  * @returns {boolean} TRUE if field exists and current field value
//  *                    does NOT match supplied value. FALSE otherwise.
//  */
// const fieldShouldUpdate = (fields, id, value) => {
//   for (let a = 0; a < fields.length; a += 1) {
//     if (fields[a].id === id && fields[a].value !== value) {
//       return true
//     }
//   }
//   return false
// }

const updateFields = (state, payload) => {
  const { id, key, value } = payload
  // console.group('updateFields()')
  // console.log('id:', id)
  // console.log('key:', key)
  // console.log('value:', value)
  // console.log('state[' + key + ']:', state[key])
  // console.log('isNumeric(state[' + key + ']):', isNumeric(state[key]))
  // console.log('isStr(state[' + key + ']):', isStr(state[key]))
  // console.log('state[' + key + '] !== value', state[key] !== value)
  // console.groupEnd()

  switch (id) {
    case 'extraInputs':
      if ((isNumeric(state[key]) || isStr(state[key])) && state[key] !== value) {
        const tmp = { ...state }
        tmp[key] = value
        // console.log('tmp:', tmp)
        return tmp
      } else if (isBool(state[key][value])) {
        const tmp1 = { ...state[key] }
        tmp1[value] = !tmp1[value]
        const _inputExtra = { ...state }
        _inputExtra[key] = tmp1
        return _inputExtra
      }
      break

    // case 'input':
    //   return {
    //     ...state,
    //     inputPrimary: value
    //   }

    // case 'output':

    //   return (isBoolTrue(debug))
    //     ? {
    //         ...state,
    //         outputPrimary: value
    //       }
    //     : {
    //         ...state,
    //         inputPrimary: value
    //       }
  }
  return state
}

/**
 * Reducer for Repeatable state
 *
 * @param {object} state
 * @param {object} action
 *
 *  @returns {object}
 */
export const repeatableReducer = (state = defaultRepeat, action = { type: 'default' }) => {
  // console.group('repeatableReducer()')
  // console.log('action:', action)
  // console.groupEnd()
  switch (action.type) {
    case repeatActions.SET_ACTION:
      return (action.payload !== false)
        ? {
            ...state,
            activeAction: action.payload,
            extraInputs: getExtraInputKeyValues(
              action.payload.extraInputs,
              action.payload.get
            ),
            extraOutputs: []
          }
        : state

    case repeatActions.REGISTER_ALL_ACTIONS:
      return {
        ...state,
        allActions: sortActionsList(action.payload),
        actionsCount: action.payload.length
      }

    case repeatActions.UPDATE_FIELD:
      // console.log('type:', repeatActions.UPDATE_FIELD)
      // console.log('payload:', action.payload)
      return {
        ...state,
        extraInputs: updateFields(
          state.extraInputs,
          action.payload
        )
      }

      // case repeatActions.MODIFY_INPUT:
      //   if (typeof action.payload === 'string') {
      //     return (state.fields.value !== action.payload)
      //       ? { ...state, fields: { ...state.fields, value: action.payload } }
      //       : state
      //   } else if (fieldShouldUpdate(state.fields.outputs, action.payload.id, action.payload.value)) {
      //     return {
      //       ...state,
      //       outputs: state.outputs.map((output) => {
      //         return (output.id === action.payload.id) ? { ...output, value: action.payload.value } : output
      //       })
      //     }
      //   } else {
      //     return state
      //   }

      // case repeatActions.REGISTER_GROUP:
      //   return (objectExistsInList(state.fields.groups, action.payload.id) === false)
      //     ? { ...state, fields: { ...state.fields, groups: action.payload } }
      //     : state

    case repeatActions.TOGGLE_NAV:
      return {
        ...state,
        navOpen: !state.navOpen
      }

    case repeatActions.FILTER:
      return {
        ...state,
        filter: action.payload
      }

      // case repeatActions.TOGGLE_DEBUG:
      //   return {
      //     ...state,
      //     debug: !state.debug
      //   }

    default:
      return state
  }
}
