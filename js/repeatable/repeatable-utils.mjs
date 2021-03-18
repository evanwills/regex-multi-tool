/* jslint browser: true */
/* global fetch */

import { isIterable, isFunction } from '../utility-functions.mjs'

/**
 * Run multiple regular expressions sequentially on a single string
 *
 * @param {string} input       The string which all the regexs are to
 *                             be applied
 * @param {array}  findReplace List of Find/Replace pairs where the
 *                             find property will be converted into
 *                             a RegExp object
 *                             findReplace object:
 *                             ```javascript
 *                             {
 *                               find:    (required)
 *                                        [regular expression string]
 *                               replace: (required)
 *                                        [replacement string]
 *                               flags:   (optional)
 *                                        [Override flags for this regex]
 *                             }
 *                             ```
 * @param {string} flags       RegExp flags to be passed for all
 *                             regexes (default is `ig`)
 *
 * @returns {string} Updated string
 */
export const multiRegexReplace = (input, findReplace, flags) => {
  if (typeof input !== 'string') {
    console.error('multiRegexReplace() expects first parameter "input" to be a string. ' + typeof input + ' given.')
  }
  if (!Array.isArray(findReplace) && !isIterable(findReplace)) {
    console.error('multiRegexReplace() expects parameter second "findReplace" to be an array. ' + typeof findReplace + ' given.')
  }
  let _output = input

  const getValidFlags = (regExpFlag) => {
    return regExpFlag.replace(/[^gimsuy]+/g, '')
  }

  const _flags = (typeof flags === 'string') ? getValidFlags(flags) : 'ig'
  if (flags !== _flags) {
    console.warn('multiRegexReplace() expects third parameter "flags" to contain valid JavaScript flags ("i", "g", "m", "s", "u", "y") supplied global flags ("' + flags + '") contained invalid characters')
  }

  // let b = 0
  for (const a in findReplace) {
    const pair = findReplace[a]

    if (typeof pair.find !== 'string' || (typeof pair.replace !== 'string' && !isFunction(pair.replace))) {
      console.group('findreplace[' + a + ']')
      console.log('pair:', pair)
      console.error('multiRegexReplace() expects pair to be a valid find/replace object. It is missing either a "find" or "replace" property')
      console.groupEnd()
    }

    let _regex = null

    // use override flags if available
    const tmpFlags = (typeof pair.flags === 'string') ? getValidFlags(pair.flags) : _flags

    try {
      _regex = new RegExp(pair.find, tmpFlags)
    } catch (e) {
      console.group('findreplace[' + a + ']')
      console.log('pair:', pair)
      console.log('pair.find:', pair.find)
      console.log('tmpFlags:', tmpFlags)
      console.log('_regex:', _regex)
      console.error('multiRegexReplace() expects findReplace[' + a + '].find to contain a valid regular expression. It had the following error: "' + e.message + '"')
      console.groupEnd()
    }
    // console.group('findreplace[' + a + ']')
    // console.log('pair:', pair)
    // console.log('pair.find:', pair.find)
    // console.log('pair.replace:', pair.replace)
    // console.log('tmpFlags:', tmpFlags)
    // console.log('_regex:', _regex)
    // console.log('BEFORE:', _output)
    // console.log('AFTER:', _output.replace(_regex, pair.replace))
    // console.groupEnd()

    _output = _output.replace(_regex, pair.replace)
    // b += 1
  }

  return _output
}

/**
 * Run multiple (literal) regular expressions sequentially on a
 * single string
 *
 * @param {string} input       The string which all the regexs are to
 *                             be applied
 * @param {array}  findReplace List of Find/Replace pairs where the
 *                             find property will be converted into
 *                             a RegExp object
 *                             findReplace object:
 *                             ```javascript
 *                             {
 *                               find:    (required)
 *                                        [literal regular expression]
 *                               replace: (required)
 *                                        [replacement string]
 *                             }
 *                             ```
 *
 * @returns {string} Updated string
 */
export const multiLitRegexReplace = (input, findReplace) => {
  if (typeof input !== 'string') {
    console.error('multiRegexReplace() expects first parameter "input" to be a string. ' + typeof input + ' given.')
  }
  if (!Array.isArray(findReplace) && !isIterable(findReplace)) {
    console.error('multiRegexReplace() expects parameter second "findReplace" to be an array. ' + typeof findReplace + ' given.')
  }
  let _output = input

  for (const a in findReplace) {
    try {
      _output = _output.replace(
        findReplace[a].find,
        findReplace[a].replace
      )
    } catch (e) {
      console.group('findreplace[' + a + ']')
      console.log('findreplace[' + a + '].find:', findReplace[a].find)
      console.log('findreplace[' + a + '].replace:', findReplace[a].replace)
      console.error('multiLitRegexReplace() expects findReplace[' + a + '].find to contain a valid regular expression. It had the following error: "' + e.message + '"')
      console.groupEnd()
    }
  }
  return _output
}

/**
 * Convert object into string to be used as the POST values to be
 * passed with the request
 *
 * @param {object} data
 *
 * @returns {string}
 */
const makePost = (data) => {
  const keys = Object.keys(data)
  let output = ''
  let sep = ''
  let hasInput = false

  for (let a = 0; a < keys.length; a += 1) {
    const key = keys[a]

    if (key !== 'input') {
      output += sep + key + '=' + encodeURI(data[key])
      sep = '&'
    } else {
      hasInput = true
    }
  }

  if (hasInput) {
    output += sep + 'input=' + encodeURI(data.input)
  }
  return output
}

/**
 * The function that actually does the remote request
 *
 * @param {string} url      URL for
 * @param {object} postData key/value pairs sent as body for remote request
 *
 * @returns {Promise}
 */
export const callRemoteAction = async (url, postData) => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      // 'Content-Type': 'application/json'
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    // body data type must match "Content-Type" header
    // body: 'data=' + JSON.stringify(postData)
    body: makePost(postData)
  })

  return JSON.parse(response) // parses JSON response into native JavaScript objects
}

/**
 * Generate an action function for a remote action
 *
 * @param {object} config Action config
 * @param {string} url    URL for XHR call
 *
 * @returns {function}
 */
export const getRemoteActionFunc = (config, url) => {
  // set up remote action
  const userFields = []

  for (let a = 0; a < config.extraInputs.length; a += 1) {
    userFields.push(config.extraInputs[a].id)
  }

  // ----------------------------------------
  // start remote func

  return async (input, _extraInputs, GETvars) => {
    const post = {
      input: input
    }
    const GETvarKeys = Object.keys(GETvars)
    let output = input

    for (let a = 0; a < GETvarKeys.length; a += 1) {
      post[GETvarKeys[a]] = GETvars[GETvarKeys[a]]
    }

    for (let a = 0; a < userFields.length; a += 1) {
      post[userFields[a]] = _extraInputs[userFields[a]]()
    }

    await callRemoteAction(url + config.action, post).then((data) => {
      output = data.output
    })

    return output
  }

  // END remote func
  // ----------------------------------------
}
