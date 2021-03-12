/* jslint browser: true */

/**
 * polyfil for new URL() call (but with better GET and hash parsing)
 * (see: https://developer.mozilla.org/en-US/docs/Web/API/URL/URL)
 *
 * convert a URL string into a URL object
 * @param {string} url url to be parsed
 * @returns {URL} url object, identical to new URL() call
 *                (except the hash can be before or after
 *                 the GET string)
 */
export const getURLobject = (url) => {
  let urlParts
  let i = 0
  const output = {
    hash: '',
    host: '',
    hostname: '',
    href: '',
    origin: '',
    password: '',
    pathname: '',
    port: '',
    protocol: '',
    search: '',
    searchParams: {},
    searchParamsRaw: {},
    username: ''
  }
  let key = ''
  let tmp = ''
  let _url = ''

  if (typeof url === 'string') {
    _url = url
  } else if (typeof url.href === 'string') {
    _url = url.href
  }

  const cleanGET = (input) => {
    const _output = decodeURI(input)

    if (_output.toLowerCase() === 'true') {
      return true
    } else if (_output.toLowerCase() === 'false') {
      return false
    } else if (isNumeric(_output)) {
      return (_output * 1)
    }
    return _output
  }

  if (typeof _url === 'string' && _url[0] !== '#') {
    urlParts = _url.match(/^((https?:|file:\/)?\/\/([^:/#?]+))(:[0-9]+)?((?:\/[^?#/]*)+)?(?:(\?)([^#]*)(?:(#)(.*))?|(#)([^?]*)(?:(\?)(.*))?)?$/i)

    if (urlParts.length >= 3) {
      output.origin = urlParts[1]
      output.protocol = urlParts[2].toLowerCase()
      output.href = url
      output.hostname = urlParts[3]
      output.host = urlParts[3]
      if (typeof urlParts[4] !== 'undefined') {
        output.port = urlParts[4]
      }
      if (typeof urlParts[5] !== 'undefined') {
        output.pathname = urlParts[5]
      }

      if (typeof urlParts[6] !== 'undefined') {
        output.search = urlParts[7]
      } else if (typeof urlParts[12] !== 'undefined') {
        output.search = urlParts[13]
      }

      if (typeof urlParts[8] !== 'undefined') {
        output.hash = '#' + urlParts[9]
      } else if (typeof urlParts[10] !== 'undefined') {
        output.hash = '#' + urlParts[11]
      }

      if (output.search !== '') {
        tmp = output.search.split('&')

        for (i = 0; i < tmp.length; i += 1) {
          tmp[i] = tmp[i].split('=')
          key = tmp[i][0]
          output.searchParams[key] = cleanGET(tmp[i][1])
          output.searchParamsRaw[key] = tmp[i][1]
        }

        output.search = '?' + output.search
      }

      if (output.protocol === '' && typeof window !== 'undefined' && typeof window.location !== 'undefined' && typeof window.location.protocol !== 'undefined') {
        output.protocol = window.location.protocol
      }
    }
  }

  return output
}

// ======================================================
// START: validation functions

/**
 * Check whether something is a string
 *
 * @param {mixed} input value that shoudl be a string
 *
 * @returns {boolean} TRUE if the input is a string
 */
export const isString = (input) => {
  return (typeof input === 'string')
}

/**
 * Check whether something is a boolean
 *
 * @param {mixed} input value that shoudl be a boolean
 *
 * @returns {boolean} TRUE if the input is a boolean
 */
export const isBool = (input) => {
  return (typeof input === 'boolean')
}

/**
 * Check whether something is a number
 *
 * @param {mixed} input Value that should be a number
 *
 * @returns {boolean} TRUE if the input is a number
 */
export const isNumber = (input) => {
  return (typeof input === 'number' && !isNaN(parseFloat(input)) && isFinite(input))
}

/**
 * Check whether something is a Function
 *
 * @param {mixed} input Value that should be numeric
 *
 * @returns {boolean} TRUE if the input is a Function
 */
export const isNumeric = (input) => {
  if (isNumber(input)) {
    return true
  } else if (typeof input === 'string') {
    return isNumber(input * 1)
  } else {
    return false
  }
}

/**
 * Check whether something is a Function
 *
 * @param {mixed} functionToCheck function
 *
 * @returns {boolean} TRUE if the input is a Function
 */
export const isFunction = (functionToCheck) => {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}

/**
 * Test whether an object contains a given property and the value
 * of that property is a string
 *
 * @param {string} prop
 * @param {object} input
 *
 * @returns {false,string} If the value is a string then it is NOT
 *                         invalid. Otherwise the value's data type
 *                         returned (so it can be used when
 *                         reporting erros).
 */
export const invalidString = (prop, input, notEmpty) => {
  let tmp = ''

  if (!isString(prop)) {
    throw new Error('invalidString() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (typeof input !== 'object') {
    throw new Error('invalidString() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  tmp = typeof input[prop]
  notEmpty = isBool(notEmpty) ? notEmpty : true
  if (tmp !== 'string') {
    return tmp
  } else if (notEmpty === true && input[prop].trim() === '') {
    return 'empty string'
  } else {
    return false
  }
}

/**
 * Test whether an object contains a given property and the value
 * of that property is either a string or a number
 *
 * @param {string} prop
 * @param {object} input
 *
 * @returns {false,string} If the value is a string or number then
 *                         it is NOT invalid. Otherwise the value's
 *                         data type returned (so it can be used when
 *                         reporting errors).
 */
export const invalidStrNum = (prop, input) => {
  let tmp = ''

  if (typeof prop !== 'string') {
    throw new Error('invalidStrNum() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (typeof input !== 'object') {
    throw new Error('invalidStrNum() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  tmp = typeof input[prop]
  if (tmp !== 'string' && tmp !== 'number') {
    return tmp
  } else {
    return false
  }
}

/**
 * Test whether an object contains a given property and the value
 * of that property is a number
 *
 * @param {string} prop
 * @param {object} input
 *
 * @returns {false,string} If the value is a number then it is NOT
 *                         invalid. Otherwise the value's data type
 *                         returned (so it can be used when
 *                         reporting errors).
 */
export const invalidNum = (prop, input) => {
  let tmp = ''

  if (typeof prop !== 'string') {
    throw new Error('invalidNum() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (typeof input !== 'object') {
    throw new Error('invalidNum() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  tmp = typeof input[prop]
  if (tmp === 'undefined') {
    return tmp
  } else if (!isNumber(input[prop])) {
    return tmp + ' (is not a number)'
  } else {
    return false
  }
}

/**
 * Test whether an object contains a given property and the value
 * of that property is an array
 *
 * @param {string} prop
 * @param {object} input
 *
 * @returns {false,string} If the value is an array then it is NOT
 *                         invalid. Otherwise the value's data type
 *                         returned (so it can be used when
 *                         reporting errors).
 */
export const invalidArray = (prop, input) => {
  if (typeof prop !== 'string') {
    throw new Error('invalidArray() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (typeof input !== 'object') {
    throw new Error('invalidArray() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }
  if (!Array.isArray(input[prop])) {
    return typeof input[prop] + ' (not Array)'
  } else if (input[prop].length === 0) {
    return 'empty array'
  } else {
    return false
  }
}

/**
 * Test whether an object contains a given property and the value
 * of that property is a boolean
 *
 * @param {string} prop
 * @param {object} input
 *
 * @returns {false,string} If the value is a boolean then it is NOT
 *                         invalid. Otherwise the value's data type
 *                         returned (so it can be used when
 *                         reporting errors).
 */
export const invalidBool = (prop, input) => {
  if (typeof prop !== 'string') {
    throw new Error('invalidArray() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (typeof input !== 'object') {
    throw new Error('invalidArray() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  const _type = typeof input[prop]
  return (_type !== 'boolean') ? _type : false
}

/**
 * Test whether a variable is iterable
 *
 * @param {mixed} value to be tested
 *
 * @return {boolean} True if input is an array or iterable object
 */
export const isIterable = (input) => {
  // checks for null and undefined
  if (input == null) {
    return false
  }
  return (typeof input[Symbol.iterator] === 'function' || typeof input.propertyIsEnumerable === 'function')
}

//  END: validation functions
// ======================================================

/**
 * makeAttributeSafe() makes a string safe to be used as an ID or
 * class name
 *
 * @param {string} _attr A string to be made safe to use as a HTML
 *             class name or ID
 *
 * @returns {string} class name or ID safe string
 */
export const makeAttributeSafe = (_attr) => {
  let _output = ''

  if (typeof _attr !== 'string') {
    throw new Error('makeAttributeSafe() expects only parameter "_attr" to be a non-empty string. ' + typeof _attr + ' given.')
  }

  _output = _attr.replace(/[^a-z0-9_\\-]+/ig, '')

  if (_output === '') {
    throw new Error('makeAttributeSafe() expects only parameter "_attr" to be string that can be used as an HTML class name or ID. "' + _attr + '" cannot be used. After cleaning, it became an empty string.')
  }

  if (!_output.match(/^[a-z_-]/i)) {
    _output = '_' + _output
  }

  return _output
}

/**
 * makeHumanReadableAttr() makes a string safe to be used as an ID or
 * class name
 *
 * @param {string} _attr A string to be made safe to use as a HTML
 *             class name or ID
 *
 * @returns {string} class name or ID safe string
 */
export const makeHumanReadableAttr = (_attr) => {
  let _output = ''

  if (typeof _attr !== 'string') {
    throw new Error('makeAttributeSafe() expects only parameter "_attr" to be a non-empty string. ' + typeof _attr + ' given.')
  }

  _output = _attr.replace(/[^a-z0-9_\\-]+([a-z]?)/ig, (match, p1) => {
    return (typeof p1 !== 'undefined') ? p1.toUpperCase() : ''
  })

  if (_output === '') {
    throw new Error('makeHumanReadableAttr() expects only parameter "_attr" to be string that can be used as an HTML class name or ID. "' + _attr + '" cannot be used. After cleaning, it became an empty string.')
  }

  if (!_output.match(/^[a-z_-]/i)) {
    _output = '_' + _output
  }
  return _output
}

/**
 * Make user group name more human readable
 *
 * @param {string} input Name of user group action belongs to
 *
 * @returns {string} Human readable version of group name
 */
export const groupNameToLabel = (input) => {
  const groupLabel = (whole, num1, letter1, word1, word2) => {
    if (letter1 !== '') {
      return num1 + ' ' + letter1.toUpperCase() + word1
    } else {
      return ' ' + word2
    }
  }

  let output = input.replace(/^([0-9-_]*)([a-z])([a-z]+)|([A-Z][a-z]+)/g, groupLabel)

  output = output.replace(/\s*_+\s*/g, ' ')
  output = output.replace(/\s*-+\s*/g, ' - ')

  return output.trim()
}
