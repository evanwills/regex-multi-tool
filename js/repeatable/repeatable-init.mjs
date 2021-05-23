/**
 * This file contains the main code for the "repeatable"
 * functionality part of Regex Multi-Tool
 *
 * @package RegexMultiTool
 * @author Evan Wills <evan.i.wills@gmail.com
 * @url https://github.com/evanwills/regex-multi-tool
 */

import {
  invalidBool,
  // invalidNum,
  invalidString,
  isBool,
  isBoolTrue,
  isFunction,
  isNonEmptyStr,
  isNumber,
  // isNumeric,
  isStr,
  isStrNum
} from '../utilities/validation.mjs'

import { url } from '../url.mjs'

// ======================================================
// START: pure helper function

/**
 * Test whether a group name is valid or not.
 *
 * @param {string} groupName Name of action group
 *
 * @returns {boolean} True if group name is valid
 */
const validGroupName = (groupName) => {
  return (groupName.match(/^[a-z]{2}[0-9a-z-]{0,48}$/i) !== null)
}

/**
 * Add a new group name to the list of groups the user wants
 * access to
 *
 * @param {array}  actionGroupList list of already registered
 *                                 groups
 * @param {string} groupName       New group name to be added to
 *                                 registry
 *
 * @returns {array}
 */
const addToGroup = (actionGroupList, groupName) => {
  const tmpGroup = groupName.trim().toLowerCase()

  if (validGroupName(tmpGroup)) {
    if (actionGroupList.indexOf(tmpGroup) === -1) {
      actionGroupList.push(tmpGroup)
    }
  } else {
    console.error('groupName: "' + groupName + '" is invalid')
  }

  return actionGroupList
}

//  END:  pure helper function
// ======================================================
// START: constructor functions

/**
 * Constructor for Regex-Multi-Tool repeatable actions
 *
 * @param {object}  url    Object containing all the parts of a URL
 *                         in easy to used
 * @param {boolean} remote Whether or not to allow remote actions
 *                         from this source
 * @param {string}  docs   URL for documentation for regex-multi-tool
 *                         repeatable
 * @param {string}  api    URL for regex-multi-tool repeatable API
 */
function Repeatable (url, _remote, docs, api) {
  // ============================================
  // START: private property declarations

  /**
   * The object containing the function and metadata for the current action
   *
   * @var {config} currentAction
   */
  let currentAction = null

  /**
   * @var {array} actionGroups list of action groups user has access to
   */
  let actionGroups = []

  /**
   * Whether or not to allow remote requests
   *
   * @var {boolean} allowRemote
   */
  const allowRemote = (typeof _remote !== 'boolean') ? true : _remote

  const apiURL = (typeof api === 'string') ? api : ''

  /**
   * URL for Documentation.
   *
   * @var {string} docsURL
   */
  const docsURL = (typeof docs === 'string' && docs !== '')
    ? docs
    : 'docs/regex-multi-tool_repeatable-actions_help.html'

  /**
   * Wheter regex multi-tool is being served via HTTPS
   *
   * @var {boolean} isHTTPS
   */
  const isHTTPS = (url.protocol.substr(0, 5) === 'https')

  /**
   * The name of an action set to NOT be ignored
   *
   * @var {boolean} noIgnore
   */
  const noIgnore = isBoolTrue(url.searchParams.noIgnore)

  /**
   * List of objects where the key is the action name and the value
   * is all the metadata for the action plus the action function
   *
   * @var {object} registry
   */
  let registry = []

  //  END:  private property declarations
  // ============================================
  // START: private method declaration

  /**
   * updateRegistry adds a new action to the registry of action
   * (if appropriate).
   *
   * It also ensures that each action object has all the properties,
   * including optional properties
   *
   * @param {object} config config object used containing the
   *             action's function and all the metadata needed to
   *             initialise the action if selected
   */
  const updateRegistry = function (config) {
    let tmp = false
    const errorMsg = 'Repeatable.register() expects '

    // ====================================================
    // START: Validating fields

    if (typeof config.ignore === 'boolean' && config.ignore === true) {
      // This action has been set to IGNORE
      if (noIgnore !== config.action) {
        // The user has not overridden the IGNORE directive via the URL
        return false
      }
    }

    tmp = invalidString('id', config)
    if (tmp !== false) {
      throw Error(errorMsg + 'an "id" property that is a non-empty string. ' + tmp + ' given.')
    }

    tmp = invalidString('name', config)
    if (tmp !== false) {
      throw Error(errorMsg + 'a "name" property that is a non-empty string. ' + tmp + ' given.')
    }

    config.remote = (isBoolTrue(config.remote))

    if (config.remote === true) {
      // This is a remote action so it doesn't need to have an action funciton
      if (allowRemote === false) {
        console.warn('All remote actions are blocked from this host. Action: "' + config.name + '" will not be available')
        return false
      } else if (isHTTPS === true) {
        console.warn('"Regex Multi-tool" is not being served via HTTPS so action: "' + config.name + '" is likely to be blocked by the browser.')
      }
    } else {
      // This is a local action so it MUST have an action function
      if (typeof config.func === 'undefined' || !isFunction(config.func)) {
        throw Error(errorMsg + 'a "func" property that is a plain javascript function. ' + tmp + ' given.')
      }
    }

    tmp = invalidString('group', config, false)

    if (tmp === false) {
      tmp = config.group.trim().toLowerCase()
      if (tmp !== '' && !validGroupName(tmp)) {
        throw Error(errorMsg + 'Action group name must be a string between 2 and 50 characters long, must start with at least two alphabetical characters and can contain only alpha numeric characters and hyphens. "' + tmp + '" does not meet these requirements')
      }

      if (actionGroups.indexOf(tmp) === -1) {
        // This action is not in one of the groups the user has access
        // to. Ignore it
        return false
      }
    } else {
      config.group = 'public'
    }

    //  END:  Validating fields
    // ====================================================
    // START: setting defaults for optional fields

    config.inputLabel = (isNonEmptyStr(config.inputLabel))
      ? config.inputLabel
      : 'Input'

    config.outputLabel = (isNonEmptyStr(config.outputLabel))
      ? config.outputLabel
      : 'Output'

    config.docsURL = (typeof config.docsURL === 'string')
      ? config.docsURL
      : ''

    config.action = config.id.toLowerCase()

    config.rawGET = isBoolTrue(config.rawGET)

    config.extraInputs = (typeof config.extraInputs !== 'undefined' && Array.isArray(config.extraInputs))
      ? config.extraInputs
      : []

    config.chained = (Array.isArray(config.chained)) ? config.chained : []

    config.description = (isStr(config.description))
      ? config.description
      : ''

    //  END:  setting defaults for optional fields
    // ====================================================
    // console.log('registry:', registry)

    registry = [...registry, filterNonProps(config)]

    // console.log('registry:', registry)
    return true
  }

  /**
   * Get default value from URL GET variable or local storage
   *
   * @param {string} prop
   * @param {object} get
   * @param {object} local
   *
   * @returns {string, number, boolean, null}
   */
  const getDefaultValue = (prop, get, local) => {
    if (typeof get[prop] !== 'undefined') {
      return get[prop]
    } else if (typeof local !== 'undefined' && typeof local[prop] !== 'undefined') {
      return local[prop]
    }
    return null
  }

  /**
   * Get the default value for a checkbox input in order of priority
   *
   * 1. checkbox value as URL GET variable
   * 2. checkbox label as URL GET variable
   * 3. checkbox value as local storage variable
   * 4. checkbox label as local storage GET variable
   * 5. false
   *
   * @param {string} prop
   * @param {object} get
   * @param {object} local
   *
   * @returns {boolean}
   */
  const getOptionDefault = (value, label, get, local) => {
    // console.group('getOptionDefault()')
    // console.log('value:', value)
    // console.log('label:', label)
    // console.log('get:', get)
    // console.log('local:', local)
    // console.groupEnd()
    if (!invalidBool(value, get)) {
      return get[value]
    } else if (!invalidBool(label, get)) {
      return get[label]
    } else if (!invalidBool(value, local)) {
      return local[value]
    } else if (!invalidBool(label, local)) {
      return local[label]
    }
    return false
  }

  /**
   * Update the extra input default values from URL GET/Search
   * parameters and/or local storage
   *
   * GET variable is tested first, then local storage
   *
   * @param {array} extraInputs List of extra inputs supplied when
   *                            an action is registered
   *
   * @returns {array} List of extra inputs with the default values
   *                  updated based on URL GET/Search parameters
   */
  function presetDefaults (extraInputs, getParams, localParams) {
    // getParams
    const output = []
    const _local = (typeof localParams !== 'undefined') ? localParams : {}
    let options = []
    let hasChanged = false
    // console.group('presetDefaults()')
    // console.log('extraInputs:', extraInputs)
    // console.log('getParams:', getParams)
    // console.log('_local:', _local)

    for (let a = 0; a < extraInputs.length; a += 1) {
      if (extraInputs[a].type === 'checkbox') {
        options = extraInputs[a].options.map(option => {
          // console.log('option:', option)
          // console.log('_local[extraInputs[a].id]:', _local[extraInputs[a].id])
          return {
            ...option,
            default: getOptionDefault(
              option.value,
              option.label,
              getParams,
              (typeof _local[extraInputs[a].id] !== 'undefined') ? _local[extraInputs[a].id] : {}
            )
          }
        })
        hasChanged = true
        output.push({
          ...extraInputs[a],
          options: options
        })
      } else {
        const defaultVar = getDefaultValue(extraInputs[a].id, getParams, localParams)
        if (defaultVar !== null) {
          if (extraInputs[a].type === 'radio' || extraInputs[a].type === 'select') {
            options = extraInputs[a].options.map(option => {
              return {
                ...option,
                default: (option.value == defaultVar || option.label == defaultVar) // eslint-disable-line
              }
            })
            output.push({
              ...extraInputs[a],
              options: options
            })
            hasChanged = true
          } else {
            if (isStrNum(getParams[extraInputs[a].id])) {
              output.push({
                ...extraInputs[a],
                value: getParams[extraInputs[a].id]
              })
              hasChanged = true
            } else {
              output.push(extraInputs[a])
            }
          }
        } else {
          output.push(extraInputs[a])
        }
      }
    }
    // console.groupEnd()
    return {
      options: output,
      hasChanged: hasChanged
    }
  }

  /**
   * Remove any redundant properties from action config.
   *
   * @param {object} config Object supplied when
   *
   * @returns {object}
   */
  function filterNonProps (config) {
    const output = {}
    const okKeys = [
      'id', 'action', 'func', 'remote', 'name', 'description',
      'group', 'docsURL', 'extraInputs', 'extraOutputs',
      'chained', 'rawGet', 'inputLabel', 'outputLabel'
    ]
    const lOkKeys = okKeys.map(item => item.toLowerCase())

    for (const prop in config) {
      const i = lOkKeys.indexOf(prop.toLowerCase())
      if (i > -1) {
        output[okKeys[i]] = config[prop]
      }
    }
    return output
  }

  /**
   * Convert Redux state for (repeatable) extra inputs to an object
   * with the same keys but the value is a function that returns the
   * value for the origin key
   *
   * This is an "Adaptor" pattern function
   *
   * @param {Object} extraInputs
   *
   * @returns {object}
   */
  function convertInputsToFunctions (extraInputs) {
    // console.group('convertInputsToFunctions()')
    // console.log('extraInputs:', extraInputs)
    const output = {}
    for (const key in extraInputs) {
      const val = extraInputs[key]
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
    // console.log('output:', output)
    return output
  }

  const getActionMeta = (action) => {
    // console.log('action:', action)
    if (typeof action !== 'undefined' && action !== false) {
      const { func, chained, ..._action } = action

      _action.chained = []
      if (chained.length > 0) {
        for (let a = 0; a < chained.length; a += 1) {
          // console.log('chained[' + a + ']:', chained[a])
          const tmp = getWholeAction(chained[a], true)
          if (tmp !== false) {
            _action.chained.push({
              tmp,
              required: isBoolTrue(chained[a].required)
            })
          }
        }
      }
      return _action
    }
    return false
  }

  // const runChained = (input, extraInputs, searchParams, chained) => {

  // }

  /**
   * Get basic information about an action
   *
   * (Used for building a menu of available actions)
   *
   * @param {object} action object
   *
   * @returns {object} basic metadata for an action
   */
  const getActionMetaBasic = (action) => {
    if (typeof action !== 'undefined' && action !== null) {
      return {
        id: action.id,
        name: action.name,
        group: action.group
      }
    }
    return false
  }

  /**
   *
   * @param {string}  actionID  ID of the action to be gotten
   * @param {boolean} noChained Whether to remove the chained
   *                            (and func) property from the output
   *
   * @returns {object} The object for the action specified by the
   *                   action ID
   */
  const getWholeAction = (actionID, noChained) => {
    // const newAction = registry.filter(action => action.id === actionID)
    const actionid = actionID.toLowerCase()
    const newAction = registry.filter(action => {
      return action.action === actionid
    })
    // console.group('getWholeAction()')
    // console.log('actionID:', actionID)
    // console.log('newAction:', newAction)
    // console.groupEnd()

    if (newAction.length === 1) {
      if (isBoolTrue(noChained)) {
        const { func, chained, ...output } = newAction[0]
        return output
      } else {
        return newAction[0]
      }
    }
    return false
  }

  //  END:  private method declaration
  // ============================================
  // START: public method declaration

  /**
   * Register an action, making it available for use and creating
   * a link in the navigation.
   *
   * @param {object} config all the metadata for a given action.
   *             Object has three required properties:
   *             1. 'action' - Identifier for the action
   *                           (used in the URL)
   *             2. 'name' - Human readable name of the action
   *                           (used in the heading and link)
   *             3. 'function' - function that does the actual work
   *                           of the action
   *                           (used when "Modify input" is clicked)
   *
   * @returns {void}
   */
  this.register = function (config) {
    let registerOk = false

    try {
      registerOk = updateRegistry(config)
    } catch (error) {
      console.error('repeat.register() expects config to contain ' + error)
      return false
    }

    return registerOk
  }

  /**
   * Set the action to be used from now on.
   *
   * @param {string} actionID ID of the action that is to be used
   *                          from now on
   *
   * @returns {boolean} TRUE if the action was set.
   *                    FALSE if the action could not be found
   */
  this.setAction = function (actionID) {
    const newAction = getWholeAction(actionID)

    if (newAction.length !== false) {
      currentAction = newAction
      return true
    }

    return false
  }

  /**
   * Get the ID for the current action
   *
   * @returns {string}
   */
  this.setFirstAction = function (getParams, localParams) {
    if (!invalidString('action', getParams)) {
      const _action = getParams.action.toLowerCase()
      const firstAction = registry.filter(oneAction => (oneAction.action === _action))

      if (firstAction.length === 1) {
        const tmp = presetDefaults(firstAction[0].extraInputs, getParams, localParams)

        currentAction = (tmp.hasChanged)
          ? {
              ...firstAction[0],
              extraInputs: tmp.options
            }
          : firstAction[0]

        if (tmp.hasChanged) {
          // Replace action object with new version containing updated defaults
          registry = registry.map(oldAction => (oldAction.action === _action)
            ? currentAction
            : oldAction
          )
        }

        return currentAction.id
      }
    }
    return ''
  }

  /**
   * Get the ID for the current action
   *
   * @returns {string}
   */
  this.getCurrentActionID = function () {
    return (currentAction !== null) ? currentAction.id : ''
  }

  /**
   * Get the ID for the current action
   *
   * @returns {string}
   */
  this.getCurrentActionMeta = function () {
    return getActionMeta(currentAction)
  }

  /**
   * Get a list of objects for all registered actions.
   *
   * Returns an array of objects that is safe to be added
   * (verbatum) into a redux store
   *
   * Each object contains all the metadata for that action
   * (but not the action function itself)
   *
   * @returns {Array}
   */
  this.getActionsList = function () {
    return registry.map(action => getActionMetaBasic(action))
  }

  /**
   *
   * @param {string} input user supplied content (expects HTML code)
   * @param {object} extraInputs all the values from "extra" form
   *               fields specified when registering the ation
   * @param {object} GETvars all the GET variables from the URL as
   *               key/value pairs
   *               NOTE: numeric strings are converted to numbers and
   *                     "true" & "false" are converted to booleans
   * @param {array}  chained List of strings matching IDs of chained
   *               actions to be used. (Only actions that are in both
   *               the supplied list passed to this function _AND_
   *               the list of chained actions supplied with the
   *               primary action was registered will be used)
   *
   * @returns {string} modified version user input
   */
  this.run = function (input, extraInputs, searchParams, chained) {
    const _extraInputs = convertInputsToFunctions(extraInputs)
    // console.group('this.run()')
    // console.log('extraInputs:', extraInputs)
    // console.log('_extraInputs:', _extraInputs)
    // console.groupEnd()

    // console.log('Array.isArray(currentAction.chained):', Array.isArray(currentAction.chained))
    // console.log('currentAction.chained.length:', currentAction.chained.length)
    // console.log('Array.isArray(chained):', Array.isArray(chained))

    // if (currentAction.chained.length > 0 && Array.isArray(chained) && chained.length > 0) {
    //   return runChained(input, _extraInputs, searchParams, chained)
    // } else {
    return currentAction.func(
      input, _extraInputs, searchParams
    )
    // }
  }

  this.getDocsURL = function () {
    return docsURL
  }

  this.getApiURL = function () {
    return apiURL
  }

  /**
   * Get comma separated list of group names user belongs to
   *
   * @params {void}
   *
   * @returns {string}
   */
  this.getGroups = function () {
    return actionGroups.join(',')
  }

  /**
   * Varify that any actions that want to chain other actions only
   * list other actions that are available to the current user
   *
   * NOTE: This should be called before any actions set or run
   *
   * @returns {boolean} TRUE if all actions with chains, only chain
   *                    available actions. FALSE otherwise
   */
  this.verifyChained = function () {
    const IDs = registry.map(action => action.id)
    let output = true

    for (let a = 0; a < registry.length; a += 1) {
      if (registry[a].chained.length > 0) {
        const chain = registry[a].chained

        for (let b = 0; b < chain.length; b += 1) {
          let ok = true
          if (IDs.indexOf(chain[b].actionID) === -1) {
            console.error('"' + registry[a].name + '" Wants to chain action "' + chain[b].actionID + '". But either that action does not exist or is not available to the current user')
            output = false
            ok = false
          }
          registry[a].chained[b].ok = ok
        }
      }
    }

    return output
  }

  //  END:  public method declaration
  // ============================================
  // START: proceedural part of code (constructor stuff)

  // Get single group from URL GET variables
  if (typeof url.searchParams.group !== 'undefined') {
    actionGroups = addToGroup(actionGroups, url.searchParams.group)
  }

  // Get multiple groups from URL GET variables
  if (typeof url.searchParams.groups !== 'undefined' && url.searchParams.groups !== '') {
    const groupsList = url.searchParams.groups.split(',')

    for (let a = 0; a < groupsList.length; a += 1) {
      actionGroups = addToGroup(actionGroups, groupsList[a])
    }
  }

  //  END:  proceedural part of code (constructor stuff)
  // ======================================================
}

//  END:  constructor function
// ======================================================
// START: seting defaults

/**
 * @constant {boolean} tmpRemote Guaranteed boolean value for remote
 *                               value
 */
const tmpRemote = (typeof remote !== 'boolean' || remote === true) // eslint-disable-line

/**
 * @constant {string} tmpDocsURL Guaranteed string URL for docsURL value
 */
const tmpDocsURL = (typeof docsURL === 'string' && docsURL !== '') ? docsURL : 'docs/How_Do-JS-regex-stuff_works.html' // eslint-disable-line

/**
 * @constant {string} apiURL Guaranteed string URL for the repeatable actions API
 */
const tmpApiURL = (typeof apiURL === 'string' && apiURL !== '') ? apiURL : 'docs/How_Do-JS-regex-stuff_works.html' // eslint-disable-line

//  END:  seting defaults
// ======================================================
// START: instantiate repeatable

export const repeatable = new Repeatable(
  url,
  tmpRemote,
  tmpDocsURL,
  tmpApiURL
)

//  END:  instantiate repeatable
// ======================================================
