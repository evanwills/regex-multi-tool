/* globals localStorage */
/* jslint browser: true */

import {
  // isBoolTrue,
  isNonEmptyStr
  // isNumeric,
  // isStr
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
