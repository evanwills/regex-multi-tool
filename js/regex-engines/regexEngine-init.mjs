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
  const isHTTPS = (url.protocol.substr(0, 5) === 'https')

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
    const errorMsg = 'OneOff.register() expects '
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
