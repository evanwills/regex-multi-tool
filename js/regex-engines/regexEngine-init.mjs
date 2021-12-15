/**
 * This file contains the main code for the "one-off"
 * functionality part of Regex Multi-Tool
 *
 * @package RegexMultiTool
 * @author Evan Wills <evan.i.wills@gmail.com
 * @url https://github.com/evanwills/regex-multi-tool
 */


import { url } from '../url.mjs'

// ======================================================
// START: constructor functions

/**
 * Constructor for Regex-Multi-Tool one-off actions
 *
 * @param {object}  url    Object containing all the parts of a URL
 *                         in easy to used
 * @param {boolean} remote Whether or not to allow remote actions
 *                         from this source
 * @param {string}  docs   URL for documentation for regex-multi-tool
 *                         repeatable
 * @param {string}  api    URL for regex-multi-tool repeatable API
 */
function OneOff (url, remote, docs, api) {
  // ============================================
  // START: private property declarations

  /**
   * The object containing the function and metadata for the current action
   *
   * @var {config} currentEngine
   */
  let currentEngine = null

  /**
   * Whether or not to allow remote requests
   *
   * @var {boolean} allowRemote
   */
  const allowRemote = (typeof remote !== 'boolean') ? true : remote

  const apiURL = (typeof api === 'string') ? api : ''

  /**
   * URL for Documentation.
   *
   * @var {string} docsURL
   */
  const docsURL = (typeof docs === 'string' && docs !== '')
    ? docs
    : 'docs/regex-multi-tool_one-off-engines_help.html'

  /**
   * Wheter regex multi-tool is being served via HTTPS
   *
   * @var {boolean} isHTTPS
   */
  const isHTTPS = (url.protocol.substring(0, 5) === 'https')

  /**
   * The name of an engine set to NOT be ignored
   *
   * @var {boolean} noIgnore
   */
  const noIgnore = isBoolTrue(url.searchParams.noIgnore)

  /**
   * List of objects where the key is the regex engine name and the
   * value is all the metadata for the action plus the action function
   *
   * @var {object} registry
   */
  let registry = []

  //  END:  private property declarations
  // ============================================
  // START: private method declaration

  /**
   * updateRegistry adds a new regex engine to the registry of regex
   * engines (if appropriate).
   *
   * It also ensures that each engine object has all the properties,
   * including optional properties
   *
   * @param {object} config config object used containing the
   *             regex engine's validate, match & replace methods
   *             and all the metadata needed to initialise the engine
   *             if selected
   */
  const updateRegistry = function (config) {
    let tmp = false
    const errorMsg = 'OneOff.register() expects config to contain '

    // - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
      throw Error(
        errorMsg + 'an "id" property that is a non-empty string. ' +
        tmp + ' given.'
      )
    }

    tmp = invalidString('name', config)
    if (tmp !== false) {
      throw Error(
        errorMsg + 'a "name" property that is a non-empty string. ' +
        tmp + ' given.'
      )
    }

    config.remote = (isBoolTrue(config.remote))
    config.allowMultiLine = (isBoolTrue(config.allowMultiLine))
    config.allowChaining = (isBoolTrue(config.allowChaining))

    if (config.remote === true) {
      // This is a remote action so it doesn't need to have an action function
      if (allowRemote === false) {
        console.warn(
          'All remote Regex Engines are blocked from this host. ' +
          'Engine: "' + config.name + '" will not be available'
        )
        return false
      } else if (isHTTPS === true) {
        console.warn(
          '"Regex Multi-tool" is not being served via HTTPS so ' +
          'engine: "' + config.name + '" is likely to be blocked ' +
          'by the browser.'
        )
      }
    }

    // This is a local action so it MUST have an action function
    if (typeof config.engine !== 'object') {
      throw Error(
        errorMsg + 'an "engine" property that is a plain javascript ' +
        'function. ' + tmp + ' given.'
      )
    } else {
      const requiredMethods = [
        'validateRegex', 'validateFlags', 'validateDelims',
        'match', 'replace'
      ]
      for (let a = 0; a < requiredMethods.length; a += 1) {
        if (typeof config.engine[requiredMethods[a]] !== 'undefined' &&
            !isFunction(config.engine[requiredMethods[a]])
        )  {
          throw Error(
            errorMsg + 'an "engine" property that an object ' +
            'containing the method: ' + requiredMethods[a]
          )
        }
      }
    }

    // This is a local action so it MUST have an action function
    if (typeof config.delimiters !== 'object') {
      throw Error(
        errorMsg + 'an "delimiters" property that is a plain javascript ' +
        'object.'
      )
    }
    if (typeof config.delimiters.allow !== 'boolean') {
      throw Error(
        errorMsg + 'an "delimiters" property that contains a ' +
        'boolean "allow" child property'
      )
    }
    if (config.delimiters.allow) {

    }
  }

  /**
   * Remove any redundant properties from engine config.
   *
   * @param {object} config Object supplied when
   *
   * @returns {object}
   */
  function filterNonProps (config) {
    const output = {}
    const okKeys = [
      'id', 'engine', 'remote', 'name', 'description',
      'docsURL', 'flags', 'delimiters'
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
   * Get basic information about an action
   *
   * (Used for building a menu of available actions)
   *
   * @param {object} engine object
   *
   * @returns {object} basic metadata for an engine
   */
  const getEngineMetaBasic = (engine) => {
    if (typeof engine !== 'undefined' && engine !== null) {
      return {
        id: engine.id,
        name: engine.name
      }
    }
    return false
  }

  /**
   *
   * @param {string}  engineID  ID of the action to be gotten
   *
   * @returns {object,false} The object for the action specified by the
   *                   action ID
   */
  const getWholeEngine = (engineID) => {
    // const newEngine = registry.filter(action => action.id === actionID)
    const actionid = engineID.toLowerCase()
    const newEngine = registry.filter(action => {
      return action.action === actionid
    })
    // console.group('getWholeEngine()')
    // console.log('actionID:', actionID)
    // console.log('newEngine:', newEngine)
    // console.groupEnd()

    if (newEngine.length === 1) {
      const { func, chained, ...output } = newEngine[0]
      return output
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
   * @param {object} config all the metadata for a given Regex Engine
   *             Object has five required properties:
   *             1. 'id'   - Identifier for the action
   *                           (used in the URL)
   *             2. 'name' - Human readable name of the action
   *                           (used in the heading and link)
   *             3. 'engine' - function/class that does the actual
   *                           work of the action
   *                           (used when a regex or flags are
   *                           modified and when either "TEST" or
   *                           "REPLACE" are clicked)
   *
   * @returns {boolean} TRUE if engine was regisered, FALSE otherwise
   */
  this.register = function (config) {
    let registerOk = false

    try {
      registerOk = updateRegistry(config)
    } catch (error) {
      console.error('OneOff.register() expects config to contain ' + error)
      return false
    }

    return registerOk
  }

  /**
   * Get the ID for the current action
   *
   * @returns {string}
   */
  this.setDefaultEngine = function (getParams, localParams) {
    if (!invalidString('action', getParams)) {
      const _action = getParams.action.toLowerCase()
      const firstEngine = registry.filter(oneEngine => (oneEngine.action === _action))

      if (firstEngine.length === 1) {
        const tmp = presetDefaults(firstEngine[0].extraInputs, getParams, localParams)

        currentEngine = (tmp.hasChanged)
          ? {
              ...firstEngine[0],
              extraInputs: tmp.options
            }
          : firstEngine[0]

        if (tmp.hasChanged) {
          // Replace action object with new version containing updated defaults
          registry = registry.map(oldEngine => (oldEngine.action === _action)
            ? currentEngine
            : oldEngine
          )
        }

        return currentEngine.id
      }
    }
    return ''
  }

  /**
   * Get the ID for the current action
   *
   * @returns {string}
   */
  this.getCurrentEngineID = function () {
    return (currentEngine !== null) ? currentEngine.id : ''
  }

  /**
   * Get the ID for the current action
   *
   * @returns {string}
   */
  this.getCurrentEngineMeta = function () {
    return getEngineMeta(currentEngine)
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
  this.getEnginesList = function () {
    return registry.map(action => getEngineMetaBasic(action))
  }


  /**
   * Test what the supplied regex is valid for the current engine
   *
   * @param {array} regex Single regexPair object
   *
   * @return {object}
   */
  this.validate = function (regex) {
    return currentEngine.validate(regex)
  }

  /**
   * Test what the supplied regexes match from the supplied input
   *
   * @param {array} input user supplied content (expects an array of
   *               strings)
   * @param {array} regexes array of regex pairs and their config
   *
   * @returns {array} modified version user input
   */
  this.match = function (input, regexes) {
    return currentEngine.match(input, regexes)
  }

  /**
   * Run find & replace on supplied input using the supplied regexes
   *
   * @param {array} input user supplied content (expects an array of
   *               strings)
   * @param {array} regexes array of regex pairs and their config
   *
   * @returns {string} modified version user input
   */
  this.replace = function (input, regexes) {
    return currentEngine.replace(input, regexes)
  }

  this.getDocsURL = function () {
    return docsURL
  }

  this.getApiURL = function () {
    return apiURL
  }
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

 export const regexEngines = new OneOff(
   url,
   tmpRemote,
   tmpDocsURL,
   tmpApiURL
 )

 //  END:  instantiate repeatable
 // ======================================================
