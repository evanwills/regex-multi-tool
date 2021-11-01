import { regexPairActions, oneOffActions } from './oneOff.state.actions.mjs'
import { getID, convertEscaped } from '../../utilities/sanitise.mjs'
import { mainAppActions } from '../main-app/main-app.state.actions.mjs'

// ==============================================
// START: Utility functions

/**
 * Get clone of specified pair and original pair's position in the
 * list or regex pairs
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be moved
 *
 * @returns {object} Clone of of pair with regex and replace empty
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
          replace: '',
          settingsOpen: false
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

/**
 * Get new set of default settings based on specified regex-pair
 * components current configuration
 *
 * @param {array}  pairs           List of regex pair object
 * @param {string} id              UID for regex pair to be moved
 * @param {object} currentDefaults Regex pair settings used as
 *                                 default for current regex engine
 *
 * @returns {object,false} New regex pair settings defaults or FALSE
 *                         if matching pair could not be found or
 *                         matching pair is already the same as the
 *                         current defaults
 */
const getPairDefaults = (pairs, id, currentDefaults) => {
  const _src = pairs.filter(pair => (pair.id === id))
  let _output = false
  if (_src.length === 1) {
    _output = {
      flags: _src[0].flags,
      delims: _src[0].delims,
      multiLine: _src[0].multiLine,
      transformEscaped: _src[0].transformEscaped
    }

    const _defaultKeys = Object.keys(currentDefaults)

    for (let a = 0; a < _defaultKeys.length; a += 1) {
      const _key = _defaultKeys[a]
      if (currentDefaults[_key] !== _output[_key]) {
        // At least one property is different.
        // That's enough to go on.
        return _output
      }
    }
  }

  // Nothing has changed
  // Let the reducer handle it from here.
  return false
}

const regexPairFocusMightChange = (actionType) => {
  for (const key in regexPairActions) {
    if (actionType === regexPairActions[key] &&
        actionType !== regexPairActions.OPEN_SETTINGS &&
        actionType !== regexPairActions.CLOSE_SETTINGS &&
        actionType !== regexPairActions.SET_FOCUSED_ID
    ) {
      return true
    }
  }
  return false
}

//  END:  Utility functions
// ==============================================
// START: Middleware functions

export const oneOffMW = ({ getState, dispatch }) => next => action => {
  const _state = getState()
  if (regexPairFocusMightChange(action.type)) {
    const tmpID = (typeof action.payload.id === 'string')
      ? action.payload.id
      : action.payload

    if (_state.oneOff.regex.focusedID !== tmpID) {
      dispatch({
        type: regexPairActions.SET_FOCUSED_ID,
        payload: tmpID
      })
    }
  }

  if (_state.mode !== 'oneOff') {
    return next(action)
  }

  switch (action.type) {
    case mainAppActions.MODIFY:
      // pass current `oneOff` state to regex engine
      dispatch({
        type: oneOffActions.SET_OUTPUT
      })
      break

    case mainAppActions.TEST:
      // pass current `oneOff` state to regex engine
      dispatch({
        type: oneOffActions.SET_MATCHES
      })
      break

    case mainAppActions.RESET:
      dispatch({
        type: oneOffActions.RESET
      })
      break

    case regexPairActions.ADD_BEFORE:
    case regexPairActions.ADD_AFTER:
      return next({
        type: action.type,
        payload: getNewPairAndPos(
          _state.oneOff.regex.pairs,
          action.payload
        )
      })

    case oneOffActions.SET_MATCHES:
    case oneOffActions.SET_OUTPUT:
      return next({
        type: action.type,
        payload: explodeAndTrim(
          _state.oneOff.input.raw,
          _state.oneOff.input.split.doSplit,
          _state.oneOff.input.split.splitter,
          _state.oneOff.input.strip.before
        )
      })

    case regexPairActions.SET_AS_DEFAULT:
      return next({
        type: oneOffActions.UPDATE_DEFAULTS,
        payload: getPairDefaults(
          _state.oneOff.regex.pairs,
          action.payload, // regex pair ID
          _state.oneOff.defaults
        )
      })

    case oneOffActions.SET_SCREEN:
      const allowedScreens = ['input', 'regex', 'matches', 'output'] // eslint-disable-line

      if (allowedScreens.indexOf(action.payload) >= 0) {
        if (_state.oneOff.screen !== action.payload) {
          return next(action)
        } else {
          return false
        }
      } else {
        throw Error('Cannot set "' + action.payload + '" as OneOff screen')
      }

    default:
      return next(action)
  }
}

export const finaliseOutputMW = ({ getState, dispatch }) => next => action => {
  const _state = getState()

  switch (action.type) {
    case oneOffActions.SET_OUTPUT:
      return next({
        type: action.type,
        payload: trimAndImplode(
          action.payoload,
          _state.oneOff.input.split.doSplit,
          _state.oneOff.input.split.splitter,
          _state.oneOff.input.strip.after
        )
      })

    default:
      return next(action)
  }
}

//  END:  Middleware functions
// ==============================================
