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
  getURLobject
} from '../utility-functions.mjs'

// ======================================================
// START: pure helper function

/**
 * Regular expression testing whether a group name is valid
 *
 * NOTE: RegExp object is necessary because we need access
 *       to the RegExp.exec() method
 *
 * It is defined here so it doesn't need to be recompiled
 * every time the validGroupName() function is called
 *
 * @var {RegExp} groupNameRegex
 */
const groupNameRegex = new RegExp('^[a-z]{2}[0-9a-z-]{0,48}$') // eslint-disable-line

/**
 * Test whether a group name is valid or not.
 *
 * @param {string} groupName Name of action group
 *
 * @returns {boolean} True if group name is valid
 */
const validGroupName = (groupName) => {
  return groupNameRegex.test(groupName.trim().toLowerCase())
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
  if (validGroupName(tmpGroup) && actionGroupList.indexOf(tmpGroup) === -1) {
    actionGroupList.push(tmpGroup)
  }
  return actionGroupList
}

//  END:  pure helper function
// ======================================================
// START: constructor functions

/**
 * Constructor for Regex-Multi-Tool repeatable actions
 *
 * @param {object}  url    document.location string for the URL of
 *                         the page
 * @param {boolean} remote Whether or not to allow remote actions
 *                         from this source
 * @param {string}  docs   URL for documentation for regex-multi-tool
 *                         repeatable
 * @param {string}  api    URL for regex-multi-tool repeatable API
 */
export const Repeatable = (url, _remote, docs, api) => {
  // ============================================
  // START: private property declarations

  /**
   * The function to be called when modifying the input
   *
   * @var {function} actionFunction
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
   * updateRegistry adds a new action to the registry of action (if appropriate).
   *
   * It also ensures that each action object has all the properties, including defaults
   *
   * @param {object} config config object used containing the
   *             action's function and all the metadata needed to
   *             initialise the action if selected
   */
  const updateRegistry = function (config) {
    let tmp = false

    if (typeof config.ignore === 'boolean' && config.ignore === true) {
      // This action has been set to IGNORE
      if (noIgnore !== config.action) {
        // The user has not overridden the IGNORE directive via the URL
        return false
      }
    }

    config.remote = (typeof config.remote === 'boolean' && config.remote === true)

    if (config.remote === true) {
      if (allowRemote === false) {
        console.warn('All remote actions are blocked from this host')
        return false
      } else if (isHTTPS === true) {
        console.warn('"Regex Multi-tool" is not being served via HTTPS so is likely to be blocked by the browser.')
      }
    } else {
      if (typeof config.func === 'undefined' || !isFunction(config.func)) {
        throw new Error('a "func" property that is a plain javascript function. ' + tmp + ' given.')
      }
    }

    tmp = invalidString('group', config, false)

    if (tmp === false) {
      tmp = config.group.trim().toLowerCase()
      if (tmp !== '' && !validGroupName(tmp)) {
        throw new Error('Action group name must be a string between 2 and 50 characters long, must start with at least two alphabetical characters and can contain only alpha numeric characters and hyphens. "' + tmp + '" does not meet these requirements')
      }

      if (actionGroups.indexOf(tmp) === -1) {
        // This action is not in one of the groups the user has access
        // to. Ignore it
        return false
      }
    }

    tmp = invalidString('action', config)
    if (tmp !== false) {
      throw new Error('an "action" property that is a non-empty string. ' + tmp + ' given.')
    }

    tmp = invalidString('name', config)
    if (tmp !== false) {
      throw new Error('a "name" property that is a non-empty string. ' + tmp + ' given.')
    }

    tmp = invalidString('inputLabel', config)
    if (tmp !== false) {
      throw new Error('a "inputLabel" property that is a non-empty string. ' + tmp + ' given.')
    }

    config.inputLabel = (typeof config.inputLabel !== 'string' || config.inputLabel.trim() === '') ? 'Input' : config.inputLabel

    config.docsURL = (typeof config.docsURL === 'string')
      ? config.docsURL
      : ''

    config.action = config.action.toLowerCase()

    config.rawGET = (typeof config.rawGET === 'boolean') ? config.rawGET : false

    config.extraInputs = (typeof config.extraInputs !== 'undefined' && Array.isArray(config.extraInputs)) ? config.extraInputs : []

    // TODO: work out how to sort the registry so it's always in
    // alphabetical order (by name, not action)
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
    return registry.map(action => {
      // Remove the action function from the action object
      const { func, ignore, ..._action } = action
      return _action
    })
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
