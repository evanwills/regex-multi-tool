/* jslint browser: true */

/**
 * Convert a string into an array (if possible) and clean up array
 * items
 *
 * @param {string} input String that might contain an array
 *
 * @returns {Array, false}
 */
const parseStrArray = (input) => {
  const tmp = input.match(/^\[([^\]]*)\]$/)
  const regex = /(?:^|\s*),\s*(?:('|")\s*([^\1]*?)\s*\1|([^,]*?))\s*(?=,|$)/g
  let item
  const output = []

  while ((item = regex.exec(tmp)) !== null) {
    item = cleanGET(item)
    if (item === '') {
      continue
    } else {
      output.push(item)
    }
  }

  if (output.length > 0) {
    // Array is not empty
    return output
  }

  // Input could not be converted to an array or was empty after
  // cleaning
  return false
}

/**
 * Convert string values to appropriate javascript data types
 *
 * @param {string} input Value to be converted
 *
 * @returns {string, boolean, number, array}
 */
const cleanGET = (input) => {
  const _output = decodeURI(input.trim())

  if (_output.toLowerCase() === 'true') {
    return true
  } else if (_output.toLowerCase() === 'false') {
    return false
  } else if (isNumeric(_output)) {
    return (_output * 1)
  } else {
    const tmp = parseStrArray(_output)
    if (tmp !== false) {
      return tmp
    }
  }

  return _output
}

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
    actionHref: '',
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

  if (typeof _url === 'string' && _url[0] !== '#') {
    urlParts = _url.match(/^((https?:|file:\/)?\/\/([^:/#?]+))(:[0-9]+)?((?:\/[^?#/]*)+)?(?:(\?)([^#]*)(?:(#)(.*))?|(#)([^?]*)(?:(\?)(.*))?)?$/i)

    if (urlParts.length >= 3) {
      output.origin = urlParts[1]
      output.protocol = urlParts[2].toLowerCase()
      output.href = _url
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
          tmp[i] = tmp[i].trim()
          if (tmp[i] !== '') {
            tmp[i] = tmp[i].split('=')
            key = tmp[i][0]
            output.searchParams[key] = cleanGET(isStr(tmp[i][1]) ? tmp[i][1] : 'true')
            output.searchParamsRaw[key] = tmp[i][1]
          }
        }

        output.search = '?' + output.search
      }

      if (output.protocol === '' && typeof window !== 'undefined' && typeof window.location !== 'undefined' && typeof window.location.protocol !== 'undefined') {
        output.protocol = window.location.protocol
      }
    }
  }

  output.actionHref = stripGETaction(output.href)

  return output
}

// ======================================================
// START: validation functions

/**
 * Check whether something is a string
 *
 * @param {any} input Value that should be a string
 *
 * @returns {boolean} TRUE if the input is a string
 */
export const isStr = (input) => (typeof input === 'string')

/**
 * Tests whether a value is a string and not empty (after being trimmed)
 *
 * e.g.
 *  * isNonEmptyStr('A') = TRUE
 *  * isNonEmptyStr('\nA, B, C\t') = TRUE
 *  * isNonEmptyStr('123456') = TRUE
 *  * isNonEmptyStr('0') = TRUE
 *  * isNonEmptyStr(12345) = FALSE
 *  * isNonEmptyStr(0) = FALSE
 *  * isNonEmptyStr(' ') = FALSE
 *  * isNonEmptyStr('\n\t') = FALSE
 *
 * @param {any} input Value that should be a non-empty string
 *
 * @returns {boolean}
 */
export const isNonEmptyStr = (input) => (isStr(input) && input.trim() !== '')

/**
 * Check whether something is a boolean
 *
 * @param {any} input value that shoudl be a boolean
 *
 * @returns {boolean} TRUE if the input is a boolean
 */
export const isBool = (input) => (typeof input === 'boolean')

/**
 * Return TRUE if the input is boolean and is true otherwise
 * return FALSE
 *
 * e.g.
 *  * isBoolTrue(true) = TRUE
 *  * isBoolTrue(false) = FALSE
 *  * isBoolTrue() = FALSE
 *  * isBoolTrue(0) = FALSE
 *  * isBoolTrue(1) = FALSE
 *  * isBoolTrue('true') = FALSE
 *
 * @param {any} input value that should be boolean and _TRUE_
 *
 * @returns {boolean}
 */
export const isBoolTrue = (input) => (typeof input === 'boolean' && input === true)

/**
 * Return TRUE if the input is boolean and is FALSE otherwise
 * return FALSE
 *
 * e.g.
 *  * isBoolTrue(false) = TRUE
 *  * isBoolTrue(true) = FALSE
 *  * isBoolTrue() = FALSE
 *  * isBoolTrue(0) = FALSE
 *  * isBoolTrue(1) = FALSE
 *  * isBoolTrue('true') = FALSE
 *
 * @param {any} input value that shoudl be a boolean
 *
 * @returns {boolean}
 */
export const isBoolFalse = (input) => (typeof input === 'boolean' && input === false)

/**
 * Check whether something is a number
 *
 * @param {any} input Value that should be a number
 *
 * @returns {boolean} TRUE if the input is a number
 */
export const isNumber = (input) => {
  return (typeof input === 'number' && !isNaN(parseFloat(input)))
  // return (typeof input === 'number' && !isNaN(parseFloat(input)) && !isFinite(input))
}

/**
 * Check whether something is a Function
 *
 * @param {any} input Value that should be numeric
 *
 * @returns {boolean} TRUE if the input is a Function
 */
export const isNumeric = (input) => {
  if (isNumber(input)) {
    return true
  } else if (isStr(input)) {
    return isNumber(input * 1)
  } else {
    return false
  }
}

/**
 * Check whether something is either a string or number
 *
 * @param {any} input Value that should be numeric
 *
 * @returns {boolean} TRUE if the input is either a string or number
 */
export const isStrNum = (input) => (isNumeric(input) || isStr(input))

export const isInt = (input) => (isNumeric(input) && !isNaN(parseInt(input)))

/**
 * Check whether something is a Function
 *
 * @param {any} functionToCheck function
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
 * @param {string}  prop
 * @param {object}  input
 * @param {boolean} notEmpty
 *
 * @returns {false,string} If the value is a string then it is NOT
 *                         invalid. Otherwise the value's data type
 *                         returned (so it can be used when
 *                         reporting erros).
 */
export const invalidString = (prop, input, notEmpty) => {
  let tmp = ''

  if (!isStr(prop)) {
    throw new Error('invalidString() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
  }
  if (typeof input !== 'object') {
    throw new Error('invalidString() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
  }

  tmp = typeof input[prop]
  const _notEmpty = isBool(notEmpty) ? notEmpty : true
  if (tmp !== 'string') {
    return tmp
  } else if (_notEmpty === true && input[prop].trim() === '') {
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
 * @param {any} value to be tested
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

  _output = _attr.replace(/[^a-z0-9_\-]+/ig, '')

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

export const getTabI = (input) => {
  return (!isNumeric(input) || input !== -1) ? 0 : -1
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

/**
 * Convert String to HTML input safe string
 *
 * @param {string}  input        String to be encoded
 * @param {boolean} doubleEncode Whether or not to double encode entities
 *
 * @returns {string} HTML entity encoded string
 */
export const makeHTMLsafe = (input, doubleEncode) => {
  const htmlChars = [
    [/'/g, '&apos;'],
    [/"/g, '&quot;'],
    [/</g, '&lt;'],
    [/>/g, '&gt;']
  ]
  const amp = [/&/g, '&amp;']
  const findReplace = (typeof doubleEncode === 'boolean' && doubleEncode === true)
    ? [...htmlChars, amp]
    : [amp, ...htmlChars]

  return findReplace.reduce(
    (accumulator, pair) => accumulator.replace(pair[0], pair[1]),
    input
  )
}

export const ucFirst = (input) => {
  return input.substr(0, 1).toUpperCase() + input.substr(1)
}

export const getMeta = (input) => {
  const _tmp = input.split('-', 4)

  return {
    id: _tmp[0].trim(),
    type: isStr(_tmp[1]) ? _tmp[1].trim() : '',
    extra: isStr(_tmp[2]) ? _tmp[2].trim() : '',
    suffix: isStr(_tmp[3]) ? _tmp[3].trim() : ''
  }
}

/**
 * Get a unique ID for each regex pair
 *
 * ID is the last nine digits of JS timestamp prefixed with the
 * letter "R"
 *
 * NOTE: The number just short of 1 billion milliseconds
 *       or rougly equivalent to 11.5 days
 *
 * @returns {string}
 */
export const getID = () => {
  let basicID = 0
  // slowPoke()
  basicID = Date.now()
  basicID = basicID.toString()
  return 'R' + basicID.substr(-9) // equivalent to 11.6 days
}

/**
 * Make a string safe to be used as an ID
 *
 * @param {string} input Value to be used as an ID
 *
 * @returns {string} value that is safe to be used as an ID
 */
export const idSafe = (input) => {
  return input.replace(/[^a-z0-9_-]/ig, '')
}

const propSafeInner = (whole, alpha, num) => {
  const _num = isNumeric(num) ? num : ''
  return alpha.toUpperCase() + _num
}

export const propSafe = (input) => {
  const output = input.replace(/^[^a-z0-9]+|[^a-z0-9]+$/ig, '')
  return output.replace(/^[^a-z0-9]+(?:([a-z])|([0-9]))/ig, propSafeInner)
}

const escapeChars = [
  { find: /\\n/g, replace: '\n' },
  { find: /\\r/g, replace: '\r' },
  { find: /\\t/g, replace: '\t' }
]

/**
 * Convert escaped white space characters to their normal characters
 *
 * @param {string} input Input with escape sequences
 *
 * @returns {string} Output with escape sequences converted to their
 *                   normal characters
 */
export const convertEscaped = (input) => {
  let output = input
  for (let a = 0; a < escapeChars.length; a += 1) {
    output = output.replace(escapeChars[a].find, escapeChars.replace)
  }
  // return escapeChars.reduce((tmp, pair) => tmp.replace(pair[0], pair[1]), input)
  return output
}

/**
 * Rebuild the URL search/GET string using values from the URL
 * object stored in state
 *
 * @param {object} url Object generated by getURLobject()
 *
 * @returns {string}
 */
export const makeSearchStr = (url) => {
  let output = ''
  let sep = '?'

  for (const key in url.searchParams) {
    let value = url.searchParams[key]
    if (isBool(value)) {
      value = (value) ? 'true' : 'false'
    }
    output += sep + key + '=' + value
    // output += sep + key + '=' + encodeURIComponent(value)
    sep = '&'
  }
  return output
}

/**
 * Rebuild URL string from URL object
 *
 * Intended for updating the browser history
 *
 * @param {object} url Object generated by getURLobject()
 *
 * @returns {string}
 */
export const makeURLstr = (url) => {
  return url.pathname +
         makeSearchStr(url) +
         url.hash
}

export const stripGETaction = (href) => href.replace(/[?&]action=[^&#]+(?=[&#]|^)?/gi, '')

/**
 * Get string to use as class name for HTML element
 *
 * @param {object} props       properties for the element
 * @param {string} BEMelement  BEM *element* class name suffix
 * @param {string} BEMmodifier BEM *modifier* class name suffix
 * @param {string} prefix      Prefix for object property name to
 *                             allow for the component to have
 *                             multiple elements with different
 *                             values for the same attribute name
 *
 * @returns {string} HTML element class name
 */
 export const getClassName = (props, BEMelement, BEMmodifier, prefix) => {
  const _cls = (isNonEmptyStr(prefix)) ? prefix.trim() + 'Class' : 'class'
  const _suffix = (isNonEmptyStr(BEMelement)) ? '__' + BEMelement.trim() : ''
  const _modifier = (isNonEmptyStr(BEMmodifier)) ? '--' + BEMmodifier.trim() : ''
  let _output = (isStr(props[_cls])) ? props[_cls].trim() : ''

  _output += (_output !== '') ? _suffix : ''
  _output += (_output !== '' && _modifier !== '') ? ' ' + _output + _modifier : ''

  return _output
}
