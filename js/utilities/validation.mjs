
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
