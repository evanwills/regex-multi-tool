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
