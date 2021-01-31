import { regexPairActions, regexActions } from './single.state.actions.js'
import { getID, convertEscaped } from './utils.js'

// ==============================================
// START: Utility functions

/**
 * Get clone of specified pair and original pair's position in the
 * list or regex pairs
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be moved
 *
 * @returns {object} list of regex pairs with specified pair moved
 *                  up one position
 */
const getNewPairAndPos = (pairs, id) => {
  for (let a = 0; a < pairs.length; a += 1) {
    if (pairs[a].id === id) {
      return {
        id: id,
        newPair: {
          ...pairs[a],
          id: getID(),
          pos: 0,
          count: 0,
          regex: { pattern: '', error: '' },
          replace: ''
        },
        oldPos: a
      }
    }
  }

  // couldn't find pair return something.
  return {
    pair: {},
    pos: -1
  }
}

/**
 * Explode string and (if required) trim each string in the array
 *
 * @param {string}  _input    Raw input string
 * @param {boolean} _doSplit  Whether or not to split the input
 * @param {string}  _splitter String to use as splitter
 * @param {boolean} _trim     Whether or not to trim the input
 *                            before passing it on
 *
 * @returns {[string]} An array of input strings
 */
const explodeAndTrim = (_input, _doSplit, _splitter, _trim) => {
  const _output = (_doSplit === true) ? _input.split(convertEscaped(_splitter)) : [_input]

  return (_trim) ? _output.map(str => str.trim()) : _output
}

/**
 * Trim each string in array (if required) and concatinate all
 * the strings
 *
 * @param {[string]} _input    List of strings
 * @param {boolean}  _doSplit  Whether or not to split the input
 * @param {string}   _splitter String to use as splitter
 * @param {boolean}  _trim     Whether or not to trim the input
 *                            before passing it on
 *
 * @returns {string} An array of input strings
 */
const trimAndImplode = (_input, _doSplit, _splitter, _trim) => {
  const _escaped = convertEscaped(_splitter)
  const _throughPut = (_trim) ? _input.map(_str => _str.trim()) : _input
  let _output = ''
  let _sep = ''

  if (_doSplit === true) {
    for (let a = 0; a < _throughPut.length; a += 1) {
      _output += _sep + _throughPut[a]
      _sep = _escaped
    }
  } else {
    _output = _throughPut[0]
  }

  return _output
}

//  END:  Utility functions
// ==============================================
// START: Middleware functions

export const cloneRegexPairMW = ({ getState, dispatch }) => next => action => {
  switch (action.type) {
    case regexPairActions.ADD_BEFORE:
    case regexPairActions.ADD_AFTER:
      return next({
        type: action.type,
        payload: getNewPairAndPos(getState.single.pairs, action.payload)
      })

    default:
      return next(action)
  }
}

export const prepareInputMW = ({ getState, dispatch }) => next => action => {
  switch (action.type) {
    case regexActions.SET_MATCHES:
    case regexActions.SET_OUTPUT:
      return next({
        type: action.type,
        payload: explodeAndTrim(
          getState.single.input.raw,
          getState.single.input.split.doSplit,
          getState.single.input.split.splitter,
          getState.single.input.strip.before
        )
      })

    default:
      return next(action)
  }
}

export const finaliseOutputMW = ({ getState, dispatch }) => next => action => {
  switch (action.type) {
    case regexActions.SET_OUTPUT:
      return next({
        type: action.type,
        payload: trimAndImplode(
          action.payoload,
          getState.single.input.split.doSplit,
          getState.single.input.split.splitter,
          getState.single.input.strip.after
        )
      })

    default:
      return next(action)
  }
}

//  END:  Middleware functions
// ==============================================
