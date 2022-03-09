import {
  isBoolTrue,
  isNonEmptyStr,
  isNumeric,
  isStr
} from './validation.mjs'
import { cleanGET } from './url.mjs'

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
 * Convert a string into an array (if possible) and clean up array
 * items
 *
 * @param {string} input String that might contain an array
 *
 * @returns {Array, false}
 */
export const parseStrArray = (input) => {
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

export const getTabI = (input) => {
  return (!isNumeric(input) || input !== -1) ? 0 : -1
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

  _output = _attr.replace(/[^a-z0-9_-]+/ig, '')

  if (_output === '') {
    throw new Error('makeAttributeSafe() expects only parameter "_attr" to be string that can be used as an HTML class name or ID. "' + _attr + '" cannot be used. After cleaning, it became an empty string.')
  }

  if (!_output.match(/^[a-z_-]/i)) {
    _output = '_' + _output
  }

  return _output
}

/**
 * Convert String to HTML input safe string
 *
 * @param {string}  input        String to be encoded
 * @param {boolean} doubleEncode Whether or not to double encode entities
 *
 * @returns {string} HTML entity encoded string
 */
export const makeHTMLsafe = (input, doubleEncode, inputField) => {
  const htmlChars = [[/</g, '&lt;'], [/>/g, '&gt;']]
  const amp = [/&/g, '&amp;']
  const findReplace = (typeof doubleEncode === 'boolean' && doubleEncode === true)
    ? [...htmlChars, amp]
    : [amp, ...htmlChars]

  if (isBoolTrue(inputField)) {
    htmlChars.concat([[/'/g, '&apos;'], [/"/g, '&quot;']])
  }

  return findReplace.reduce(
    (accumulator, pair) => accumulator.replace(pair[0], pair[1]),
    input
  )
}

export const ucFirst = (input) => {
  const replacer = (match, prefix, char) => {
    return prefix + char.toUpperCase()
  }

  return input.replace(/^([^a-z]*)([a-z])/i, replacer)
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

/**
 * Add padding characters to a string to ensure it's the right
 * length
 *
 * @param {string,number} input  Input to be padded
 * @param {number}        len    Final length of output
 * @param {string}        char   Character to use as padding
 *                               [Default: ' ']
 * @param {bool}          centre Centre the text within the padding
 *
 * @returns {string}
 */
export const padStr = (input, len, char, centre) => {
  let strL = ''
  let strR = ''
  const _char = (!isStr(char)) ? ' ' : char
  const _centre = (isBoolTrue(centre) || input.toLowerCase() === 'null')

  const _input = input.toString()
  const _iLen = _input.length

  for (let a = _iLen; a < len; a += 2) {
    strR += _char
    if ((strL.length + strR.length + _iLen) < len) {
      strL += _char
    }
  }

  const output = (isNumeric(input))
    ? strL + strR + _input
    : (_centre)
        ? strL + _input + strR
        : _input + strL + strR

  return _char + output + _char
}

/**
 * Add padding characters to a the left side of a string to ensure
 * it's the right length
 *
 * @param {string,number} input  Input to be padded
 * @param {number}        len    Final length of output
 * @param {string}        char   Character to use as padding
 *                               [Default: ' ']
 *
 * @returns {string}
 */
export const padStrLeft = (input, len, char) => {
  const _char = (!isStr(char)) ? ' ' : char
  const _iLen = input.length

  let output = input.toString()

  for (let a = _iLen; a < len; a += 1) {
    output = _char + output
  }

  return output
}

export const snakeToCamelCase = (input, start = 0) => {
  const splitter = (input.indexOf('-') > -1)
    ? '-'
    : '_'
  const tmp = input.split(splitter)
  let output = tmp[start]

  for (let a = start + 1; a < tmp.length; a += 1) {
    output += ucFirst(tmp[a])
  }

  return output
}

export const camel2human = (input) => {
  return input.replace(/(?<=[a-z0-9])(?=[A-Z])/g, ' ')
}

/**
 * Strip trailing "s" from pluralised words
 *
 * (may not be gramatically correct)
 *
 * @param {string} input
 * @returns {string}
 */
export const makeSingle = (input) => {
  // const output = input.trim()
  const l = input.length
  let output = input

  if (input.substring(l - 1) === 's') {
    output = (output.substring(l - 4) === 'ies')
      ? output.substring(0, l - 5) + 'y'
      : output.substring(0, l - 1)
  }

  console.log('output:', output)
  console.groupEnd()

  return output
}

/**
 * Get a function that converts boolean input to appropriate string
 * (and returns unmodified string if not boolean)
 *
 * @param {string,number} outputMode Output mode of bool2str
 *
 * @returns {function}
 */
export const getBool2str = (outputMode) => {
  let _true = ''
  let _false = ''

  switch (outputMode.toLowerCase()) {
    case 'true':
    case 'truefalse':
      _true = 'True '
      _false = 'False'
      break

    case 'yes':
    case 'yesno':
      _true = 'Yes'
      _false = 'No '
      break

    case 0:
    case 1:
    case '0':
    case '1':
    case 'zeroone':
      _true = '0'
      _false = '1'
      break
  }

  if (_true === '') {
    return (input) => {
      return input
    }
  } else {
    return (input) => {
      const _input = input.toLowerCase().trim()

      if (['true', 'yes', '1', 1].indexOf(_input) > -1) {
        return _true
      } else if (['false', 'no', '0', 0].indexOf(_input) > -1) {
        return _false
      } else {
        return input
      }
    }
  }
}
