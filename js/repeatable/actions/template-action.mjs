// Copy the below code to the appropriate action file, rename it
/* global doStuff */

// ====================================================================
// START: Action name

/**
 * Action description goes here
 *
 * created by: Firstname LastName
 * created: YYYY-MM-DD
 *
 * @param {string} input       User supplied content
 *                             (expects text HTML code)
 * @param {object} extraInputs All the values from "extra" form
 *                             fields specified when registering
 *                             the ation
 * @param {object} _GETvars    All the GET variables from the URL as
 *                             key/value pairs
 *                             NOTE: Numeric strings are converted
 *                                   to numbers and "true" & "false"
 *                                   are converted to booleans
 *
 * @returns {string} modified version user input
 */
const myFunction = (input, extraInputs, _GETvars) => {
}

doStuff.register({
  id: '',
  name: '',
  func: myFunction,
  description: '',
  // docsURL: '',
  extraInputs: [],
  // group: '',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Action name
// ====================================================================

// ----------------------------------------------
// START: extraInputs field type templates

export const _text = {
  id: '',
  label: '',
  type: 'text',
  // type: 'textarea',
  description: '',
  pattern: '',
  default: ''
}

export const _select = {
  description: '',
  id: '',
  label: '',
  options: [
    { value: '', label: '', default: true },
  ],
  type: 'select'
}

export const _checkbox = {
  id: '',
  label: '',
  options: [
    {
      default: true,
      label: '',
      value: ''
    },
  ],
  type: 'checkbox'
}

export const _radio = {
  id: '',
  label: '',
  options: [
    {
      default: true,
      label: '',
      value: ''
    },
  ],
  type: 'radio'
}

export const _number = {
  id: '',
  label: '',
  min: 1,
  max: 1000,
  step: 1,
  default: 0,
  type: 'number'
}

//  END:  extraInputs field type templates
// ----------------------------------------------
