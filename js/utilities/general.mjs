/* globals localStorage */
/* jslint browser: true */
import { getBool2str, padStr } from './sanitise.mjs'

import {
  // isBoolTrue,
  isNonEmptyStr,
  isStrNum,
  // isNumeric,
  // isStr,
} from './validation.mjs'

export const getFromLocalStorage = (prop) => {
  const tmp = localStorage.getItem(prop)
  if (tmp !== null && isNonEmptyStr(tmp)) {
    try {
      return JSON.parse(tmp)
    } catch (e) {
      console.warn(
        'Could not convert "' + prop + '" to JSON. (' + e.message + ')'
      )
    }
    return tmp
  }
  console.warn('Could not get "' + prop + '" from local storage')

  return null
}

/**
 *
 * @param {string} str     String to be padded
 * @param {number} len     Final desired length
 * @param {string} sep     Separator character
 * @param {string} padType Where to pad the string:
 *                         'r' [default] Pad right side of string
 *                         'm' or 'c' Pad both sides
 *                         'l' Pad left side of string
 * @returns
 */
export const strPad = (str, len, sep = ' ', padType = 'r') => {
  const mode = padType.substring(0, 1).toLowerCase()
  let output = str
  let diff = (len - output.length)
  let lSep = ''
  let rSep = sep
  // console.log('output:', output)
  // console.log('len:', len)
  // console.log('output.length:', output.length)
  // console.log('diff:', diff)

  if (diff > 0) {
    switch (mode) {
      case 'l':
        while (diff > 0) {
          diff -= 1
          output = sep + output
        }
        break

      case 'c':
      case 'm':
        while (diff > 0) {
          diff -= 1
          output = lSep + output + rSep

          if (lSep === '') {
            lSep = ' '
            rSep = ''
          } else {
            lSep = ''
            rSep = ' '
          }
        }
        break

      default:
        while (diff > 0) {
          diff -= 1
          output += sep
        }
    }

    return output
  }

  return output
}

/**
 * Convert a delimited string to MarkDown table
 *
 * @param {string}  input      Delimited string to convert to MarkDown table
 * @param {string}  colDelim   Column delimiter character
 * @param {string}  rowDelim   Row delimiter character
 * @param {string}  padMode    How to pad string ('l': left, 'r': right, 'c': centre)
 * @param {string}  toBoolStr  How to convert boolean values
 * @param {boolean} confluence Whether or not to use confluence style MarkDown tables
 *
 * @returns {string} MarkDown table formatted version of TSV content
 */
export const toMdTable = (
  input, col = '\\t', row = '\\n', padMode = 'r', convertBool = 'leave', confluence = false
) => {
  const delimChars = {
    '\\n': '\n',
    '\\t': '\t',
    '\\r': '\r'
  }
  const colDelim = (typeof delimChars[col] === 'string')
    ? delimChars[col]
    : col
  const lengths = []
  const _padMode = (['c', 'l', 'r'].indexOf(padMode))
    ? padMode
    : 'r'
  const rowDelim = (typeof delimChars[row] === 'string')
    ? delimChars[row]
    : row
  const toBoolStr = getBool2str(convertBool)
  let tmp = []
  let output = ''
  let sep = ''


  tmp = input.trim().split(rowDelim)

  for (let a = 0; a < tmp.length; a += 1) {
    tmp[a] = tmp[a].trim()

    if (tmp[a] === '') {
      tmp.pop()
    } else {
      tmp[a] = tmp[a].split(colDelim)

      for (let b = 0; b < tmp[a].length; b += 1) {
        tmp[a][b] = tmp[a][b].trim()

        const len = tmp[a][b].length
        if (typeof lengths[b] === 'undefined' || len > lengths[b]) {
          lengths[b] = len
        }
      }
    }
  }

  const c = tmp[0].length

  const headPipe = (confluence) ? '||' : '|'
  const lengthMod = (confluence) ? 1 : 0

  for (let a = 0; a < c; a += 1) {
    output += headPipe + ' ' + strPad(tmp[0][a], lengths[a], ' ', 'c') + ' '
    sep += '|-' + strPad('', lengths[a] + lengthMod, '-') + '-'
  }

  output += headPipe + '\n'
  if (confluence === false) {
    output += sep + '|\n'
  }

  for (let a = 1; a < tmp.length; a += 1) {
    for (let b = 0; b < c; b += 1) {
      // make sure we at least have an empty string for this cell
      tmp[a][b] = (isStrNum(tmp[a][b]))
        ? tmp[a][b]
        : ''

      const _centre = (b > 0) ? _padMode : 'r'
      output += '| ' + strPad(toBoolStr(tmp[a][b]), lengths[b] + lengthMod, ' ', _centre) + ' '
    }
    output += '|\n'
  }

  return output
}

/**
 * Round a number to an arbitrary number of decimal places
 *
 * JS Implementation of PHP's round function
 *
 *
 * @param {number} input  Value to be rounded
 * @param {number} places Number of decimal places
 *
 * @returns {number}
 */
export const round = (input, places) => {
  const x = Math.pow(10, places);

  return Math.round(input * x) / x;
}

/**
 * Generate a standardised conole group string
 *
 * @param {string} func  Function name to render in console group
 *                       output
 * @param {string} group Name of user group the function belongs to.
 *
 * @returns {string}
 */
export const consGrp = (func, group = '') => ((group !== '') ? `${group}.${func}()` : `${func}()`);
