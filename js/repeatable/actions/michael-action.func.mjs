/* jslint browser: true */
/* global btoa */

// other global functions available:
//   invalidString, invalidStrNum, invalidNum, invalidArray, makeAttributeSafe, isFunction

// import { multiLitRegexReplace } from '../repeatable-utils.mjs'
import { repeatable as doStuff } from '../repeatable-init.mjs'
// import { isBoolTrue, isNumeric } from '../../utilities/validation.mjs'
// import {
//   camel2human,
//   // makeHumanReadableAttr,
//   makeSingle,
//   padStrLeft,
//   snakeToCamelCase,
//   ucFirst
// } from '../../utilities/sanitise.mjs'

// ====================================================================
// START: Action name

/**
 * Action description goes here
 *
 * created by: Firstname LastName
 * created: YYYY-MM-DD
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const michalesCsvCleanUp = (input, extraInputs, GETvars) => {
}

doStuff.register({
  id: 'michalesCsvCleanUp',
  name: 'CSV Cleanup',
  func: michalesCsvCleanUp,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'michael',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Action name
// ====================================================================
