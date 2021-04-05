
// import {
//   // isBool,
//   // isFunction,
//   // isNumber,
//   isNumeric
//   // isStr,
//   // invalidString,
// } from '../../utilities/validation.mjs'

/**
 * Logs all actions and states after they are dispatched.
 */
export const postUpdateMW = store => next => action => {
  const result = next(action)

  return result
}
