/**
 * This file contains the main code for the "repeatable"
 * functionality part of Regex Multi-Tool
 *
 * @package RegexMultiTool
 * @author Evan Wills <evan.i.wills@gmail.com
 * @url https://github.com/evanwills/regex-multi-tool
 */
import {
  isNumeric,
  invalidString,
  isFunction,
  invalidBool,
  invalidNum,
  getURLobject
} from '../utility-functions.mjs'

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
   * List of URL GET variables
   *
   * @var {object} getParams
   */
  const getParams = url.searchParams

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
  const noIgnore = (typeof getParams.noIgnore !== 'undefined' &&
  (getParams.noIgnore === true || getParams.noIgnore === 1))

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

    tmp = invalidString('action', config)
    if (tmp !== false) {
      throw Error(errorMsg + 'an "action" property that is a non-empty string. ' + tmp + ' given.')
    }

    tmp = invalidString('name', config)
    if (tmp !== false) {
      throw Error(errorMsg + 'a "name" property that is a non-empty string. ' + tmp + ' given.')
    }

    config.remote = (typeof config.remote === 'boolean' && config.remote === true)

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

    // Validate chained actions
    if (typeof config.chainedActions !== 'undefined') {
      if (Array.isArray(config.chainedActions)) {
        for (let a = 0; a < config.chainedActions.length; a += 1) {
          tmp = invalidString('actionID', config.chainedActions[a])
          if (tmp !== false) {
            throw Error(errorMsg + 'that chained action ' + a + ' contains an "actionID" property that is a non-empty string. ' + tmp + ' given.')
          }
          tmp = invalidBool('required', config.chainedActions[a])
          if (tmp !== false && tmp !== 'undefined') {
            throw Error(errorMsg + 'that if chained action ' + a + ' contains a "required" property, that "required" is boolean. ' + tmp + ' given.')
          }
          if (typeof config.chainedActions[a].order !== 'undefined') {
            tmp = invalidNum('position', config.chainedActions[a].order)
            if (tmp !== false && tmp !== 'undefined') {
              throw Error(errorMsg + 'that if chained action ' + a + ' contains an "order" property, that "order" object must contain a "position" property that is a number. ' + tmp + ' given.')
            }
            tmp = invalidBool('force', config.chainedActions[a].order)
            if (tmp !== false && tmp !== 'undefined') {
              throw Error(errorMsg + 'that if chained action ' + a + ' contains an "order" property, that "order" object must contain a "force" property that is boolean. ' + tmp + ' given.')
            }
          }
        }
      } else {
        throw Error(errorMsg + 'an action with a "chainedActions" property that the "chainedActions" property must be an array. ' + typeof config.chainedActions + ' given.')
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

    config.inputLabel = (typeof config.inputLabel !== 'string' || config.inputLabel.trim() === '')
      ? 'Input'
      : config.inputLabel

    config.outputLabel = (typeof config.outputLabel !== 'string' || config.outputLabel.trim() === '')
      ? 'Output'
      : config.outputLabel

    config.docsURL = (typeof config.docsURL === 'string')
      ? config.docsURL
      : ''

    config.action = config.action.toLowerCase()
    config.id = config.action

    config.rawGET = (typeof config.rawGET === 'boolean' && config.rawGET === true)

    config.extraInputs = (typeof config.extraInputs !== 'undefined' && Array.isArray(config.extraInputs))
      ? config.extraInputs
      : []

    config.description = (typeof config.extraInputs !== 'string')
      ? config.description
      : ''

    //  END:  setting defaults for optional fields
    // ====================================================

    registry = [...registry, config]

    // console.log('registry:', registry)
    return true
  }

  /**
   * Convert extraInputs values from Redux store into callable
   * functions expected by repeatable actions
   *
   * This is an "Adaptor" pattern function
   *
   * @param {Object} extraInputs
   *
   * @returns {object}
   */
  function convert (extraInputs) {
    const _output = {}
    for (let a = 0; a < currentAction.extraInputs.length; a += 1) {
      const _field = currentAction.extraInputs
      const _key = _field.id
      if (typeof extraInputs[_key] !== 'undefined') {
        let value = extraInputs[_key]

        if (_field.type !== 'checkbox') {
          if (typeof value === 'string') {
            if (_field.type === 'number' && isNumeric(value)) {
              value = extraInputs[_key] * 1
            }
          }
          _output[_key] = () => value
        } else {
          _output[_key] = (val) => {
            return (typeof value[val] === 'boolean') ? value[val] : null
          }
        }
      }
    }

    return _output
  }

  const getActionMeta = (action) => {
    if (typeof action !== 'undefined' && action !== null) {
      const { func, ..._action } = action
      return _action
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
    const newAction = registry.filter(action => action.action === actionID)

    if (newAction.length === 1) {
      currentAction = newAction[0]
      return true
    }

    return false
  }

  /**
   * Get the ID for the current action
   *
   * @returns {string}
   */
  this.setFirstAction = function () {
    if (!invalidString('action', getParams)) {
      const ID = getParams.action.toLowerCase()
      const firstAction = registry.filter(_action => _action.id === ID)

      if (firstAction.length === 1) {
        currentAction = firstAction[0]
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
    console.log('currentAction:', currentAction)
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
    return registry.map(action => getActionMeta(action))
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
   *
   * @returns {string} modified version user input
   */
  this.run = function (input, extraInputs) {
    return currentAction.func(
      input, convert(extraInputs), getParams
    )
  }

  this.getDocsURL = function () {
    return docsURL
  }

  this.getApiURL = function () {
    return apiURL
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
      if (Array.isArray(registry[a].chainedActions) && registry[a].chainedActions.length > 0) {
        const chain = registry[a].chainedActions

        for (let b = 0; b < chain.length; b += 1) {
          let ok = true
          if (IDs.indexOf(chain[b].actionID) === -1) {
            console.error('"' + registry[a].name + '" Wants to chain action "' + chain[b].actionID + '". But either that action does not exist or is not available to the current user')
            output = false
            ok = false
          }
          registry[a].chainedActions[b].ok = ok
        }
      }
    }

    return output
  }

  //  END:  public method declaration
  // ============================================
  // START: proceedural part of code (constructor stuff)

  // Get single group from URL GET variables
  if (typeof getParams.group !== 'undefined') {
    actionGroups = addToGroup(actionGroups, getParams.group)
  }

  // Get multiple groups from URL GET variables
  if (typeof getParams.groups !== 'undefined' && getParams.groups !== '') {
    const groupsList = getParams.groups.split(',')

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
  getURLobject(window.location),
  tmpRemote,
  tmpDocsURL,
  tmpApiURL
)

//  END:  instantiate repeatable
// ======================================================
