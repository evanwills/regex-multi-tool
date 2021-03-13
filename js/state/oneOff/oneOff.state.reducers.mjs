import { combineReducers } from '../../redux/redux.mjs'
// import { createSlice } from '@reduxjs/toolkit'
import { regexPairActions, oneOffActions } from './oneOff.state.actions.mjs'
import { getID } from '../utils.mjs'

// ==============================================
// START: Utility functions

// /**
//  * Use up a couple of milliseconds worth of CPU time to ensure
//  * UID is unique
//  *
//  * @returns {void}
//  */
// const slowPoke = () => {
//   console.groupCollapsed('slowPoke()')
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.log(Math.sqrt(Date.now() * Math.PI))
//   console.groupEnd()
// }

/**
 * Update the pos (position) & count property of each regex pair
 *
 * @param {array} pairs List of regex pairs
 *
 * @returns {array}
 */
const updatePos = (pairs) => {
  const c = pairs.length

  return pairs.map((pair, pos) => {
    return {
      ...pair,
      pos: pos + 1,
      count: c
    }
  })
}

/**
 * Set the hasError property for the supplied regex pair and return it
 *
 * @param {object} pair Regex pair
 *
 * @returns {object} Shallow clone of original pair with hasError
 */
const setHasError = (pair) => {
  const _hasError = (pair.regex.error !== '' || pair.flags.error !== '' || pair.delimiters.error !== '')

  if (pair.hasError === _hasError) {
    // no change, just return original
    return pair
  } else {
    return {
      ...pair,
      hasError: _hasError
    }
  }
}

/**
 * Get the index of the regex pair matched by the specified ID
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be moved
 *
 * @returns {number} The index of the pair matched by the ID
 */
const getPos = (pairs, id) => {
  for (let a = 0; a < pairs.length; a += 1) {
    if (pairs[a].id === id) {
      return a
    }
  }

  // couldn't find pair return something.
  return -1
}

//  END:  Utility functions
// ==============================================
// START: Initial state

export const getDefaultPair = () => {
  return {
    pos: 1,
    count: 1,
    id: getID(),
    regex: {
      pattern: '',
      error: ''
    },
    replace: '',
    flags: {
      flags: 'ig',
      error: ''
    },
    delims: {
      allow: false,
      open: '',
      close: '',
      error: ''
    },
    hasError: '',
    multiLine: false,
    fullWidth: false,
    transformEscaped: true,
    disabled: false,
    settingsOpen: false
  }
}

const defaultPair = getDefaultPair()

export const engineDefaults = {
  engine: 'vanillaJS',
  flags: 'ig',
  delimiters: {
    open: '',
    close: ''
  },
  multiLine: false,
  transformEscaped: true
}

export const defaultInput = {
  raw: '',
  split: {
    doSplit: false,
    splitter: ''
  },
  strip: {
    before: false,
    after: false
  }
}

//  END:  Initial state
// ==============================================
// START: Reducer helpers functions

// ----------------------------------------------
// START: Updater helpers

/**
 * Update the regular expression for specified pair from the list
 * of regex pairs
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be deleted
 * @param {string} value New value for multiLine
 * @param {string} error Error message for regular expression
 *
 * @returns {array} list of regex pairs with the specified pair
 *                  updated
 */
const updatePairRegex = (pairs, id, value, error) => {
  return pairs.map((pair) => {
    if (pair.id === id) {
      const _regex = {
        pattern: value,
        error: error
      }
      return setHasError({
        ...pair,
        regex: _regex
      })
    } else {
      return pair
    }
  })
}

/**
 * Update the replacement string for specified pair from the list
 * of regex pairs
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be deleted
 * @param {string} value New value for replacement string
 *
 * @returns {array} list of regex pairs with the specified pair
 *                  updated
 */
const updatePairReplace = (pairs, id, value) => {
  return pairs.map((pair) => {
    if (pair.id === id) {
      return {
        ...pair,
        replace: value
      }
    } else {
      return pair
    }
  })
}

/**
 * Update the flags string for specified pair from the list of
 * regex pairs
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be deleted
 * @param {string} value New value for regex flags/modifiers
 * @param {string} error Error message for flags
 *
 * @returns {array} list of regex pairs with the specified pair
 *                  updated
 */
const updatePairFlags = (pairs, id, value, error) => {
  return pairs.map((pair) => {
    if (pair.id === id) {
      const _flags = {
        flags: value,
        error: error
      }
      return setHasError({
        ...pair,
        flags: _flags
      })
    } else {
      return pair
    }
  })
}

/**
 * Update the flags string for specified pair from the list of
 * regex pairs
 *
 * @param {array}   pairs List of regex pair object
 * @param {string}  id    UID for regex pair to be deleted
 * @param {string}  value New value for the specified delimiter
 * @param {boolean} open  Whether or not the delimiter is the
 *                        opening or closing delimiter
 * @param {string}  error Error message for delimiters
 *
 * @returns {array} list of regex pairs with the specified pair
 *                  updated
 */
const updatePairDelim = (pairs, id, value, open, error) => {
  return pairs.map((pair) => {
    if (pair.id === id) {
      const _delims = {
        ...pair.delimiters,
        error: error
      }
      if (open === true) {
        _delims.open = value
      } else {
        _delims.close = value
      }
      return setHasError({
        ...pair,
        delimiters: _delims
      })
    } else {
      return pair
    }
  })
}

/**
 * Update the value of transformEscaped for specified pair from the
 * list of regex pairs
 *
 * @param {array}   pairs List of regex pair object
 * @param {string}  id    UID for regex pair to be deleted
 * @param {boolean} value New value for transformEscaped
 *
 * @returns {array} list of regex pairs with the specified pair
 *                  updated
 */
const updatePairEscaped = (pairs, id) => {
  return pairs.map((pair) => {
    if (pair.id === id) {
      return {
        ...pair,
        transformEscaped: !pair.transformEscaped
      }
    } else {
      return pair
    }
  })
}

/**
 * Update the value of multiLine for specified pair from the list
 * of regex pairs
 *
 * @param {array}   pairs List of regex pair object
 * @param {string}  id    UID for regex pair to be deleted
 * @param {boolean} value New value for multiLine
 *
 * @returns {array} list of regex pairs with the specified pair
 *                  updated
 */
const updatePairMultiLine = (pairs, id) => {
  console.log('id:', id)
  return pairs.map((pair) => {
    if (pair.id === id) {
      return {
        ...pair,
        multiLine: !pair.multiLine
      }
    } else {
      return pair
    }
  })
}

/**
 * Update the value of multiLine for specified pair from the list
 * of regex pairs
 *
 * @param {array}   pairs List of regex pair object
 * @param {string}  id    UID for regex pair to be deleted
 * @param {boolean} value New value for multiLine
 *
 * @returns {array} list of regex pairs with the specified pair
 *                  updated
 */
const updatePairFullWidth = (pairs, id) => {
  console.log('id:', id)
  return pairs.map((pair) => {
    if (pair.id === id) {
      return {
        ...pair,
        fullWidth: !pair.fullWidth
      }
    } else {
      return pair
    }
  })
}

//  END:  Updater helpers
// ----------------------------------------------
// START: list helpers

/**
 * Move specified regex pair up one position in the list.
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be moved
 *
 * @returns {array} list of regex pairs with specified pair moved
 *                  up one position
 */
const movePairUp = (pairs, id) => {
  const _pos = getPos(pairs, id)
  if (_pos > -1) {
    return movePairTo(pairs, id, (_pos - 1))
  } else {
    throw Error('Could not find regex-pair matching ID: ' + id)
  }
}

/**
 * Move specified regex pair down one position in the list.
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be moved
 *
 * @returns {array} list of regex pairs with specified pair moved
 *                  down one position
 */
const movePairDown = (pairs, id) => {
  const _pos = getPos(pairs, id)
  console.log('_pos:', _pos)
  if (_pos > -1) {
    return movePairTo(pairs, id, _pos + 1)
  } else {
    throw Error('Could not find regex-pair matching ID: ' + id)
  }
}

/**
 * Move specified regex pair to specified position in the list.
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be moved
 * @param {number} pos   New position in list for regex pair
 *
 * @returns {array} list of regex pairs with specified pair moved
 *                  to the specified position position
 */
const movePairTo = (pairs, id, pos) => {
  const _pair = pairs.filter(pair => (pair.id === id))[0]
  const _oldPos = getPos(pairs, id)
  const _pairs = pairs.filter(pair => (pair.id !== id))

  const _newPos = (pos * 1)

  let output = []
  if (_oldPos === _newPos) {
    console.warn('New position is same as old position (' + _oldPos + ')')
    return pairs
  } else if (_newPos === 0) {
    output = [
      _pair, ..._pairs
    ]
  } else if (_newPos === _pairs.length) {
    output = [
      ..._pairs, _pair
    ]
  } else {
    const _before = _pairs.slice(0, _newPos)
    const _after = _pairs.slice(_newPos)
    output = [
      ..._before,
      _pair,
      ..._after
    ]
  }

  return updatePos(output)
}

/**
 * Add a clone of the specified pair before it in the list
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be cloned
 *
 * @returns {array} list of regex pairs with cloned pair inserted
 *                  before its original pair
 */
const addPairBefore = (pairs, payload) => {
  if (payload.oldPos > -1) {
    const newPairs = [...pairs]

    newPairs.splice(payload.oldPos, 0, payload.newPair)

    return updatePos(newPairs)
  } else {
    return pairs
  }
}

/**
 * Add a clone of the specified pair after it in the list
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be cloned
 *
 * @returns {array} list of regex pairs with cloned pair inserted
 *                  after its original pair
 */
const addPairAfter = (pairs, payload) => {
  if (payload.oldPos > -1) {
    const newPairs = [...pairs]

    newPairs.splice(payload.oldPos + 1, 0, payload.newPair)

    return updatePos(newPairs)
  } else {
    return pairs
  }
}

/**
 * Reset the regular expression and replace pattern for specified
 * pair to empty strings
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be reset
 *
 * @returns {array} list of regex pairs with cloned pair inserted
 *                  before its original pair
 */
const resetPair = (pairs, id) => {
  return pairs.map(pair => {
    if (pair.id !== id) {
      return pair
    } else {
      const _regex = {
        pattern: '',
        error: ''
      }
      return {
        ...pair,
        regex: _regex,
        replace: ''
      }
    }
  })
}

/**
 * Remove specified pair from the list of regex pairs
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be deleted
 *
 * @returns {array} list of regex pairs with the specified pair
 *                  removed
 */
const deletePair = (pairs, id) => {
  if (pairs.length < 2) {
    throw Error('Cannot delete regex pair if there are less than two pairs remaining')
  }
  return updatePos(pairs.filter(pair => (pair.id !== id)))
}

/**
 * Disable/enable specified pair in the list of regex pairs
 *
 * If pair is "Disabled" it will not be used when matching/replacing
 * the input. It will however, be validated as normal
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be deleted
 *
 * @returns {array} list of regex pairs with the specified pair
 *                  disabled/enabled
 */
const disablePair = (pairs, id) => {
  return pairs.map(pair => {
    if (pair.id === id) {
      return {
        ...pair,
        disabled: !pair.disabled
      }
    } else {
      return pair
    }
  })
}

/**
 * Disable/enable specified pair in the list of regex pairs
 *
 * If pair is "Disabled" it will not be used when matching/replacing
 * the input. It will however, be validated as normal
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be deleted
 *
 * @returns {array} list of regex pairs with the specified pair
 *                  disabled/enabled
 */
const closePairSettings = (pairs) => {
  return pairs.map(pair => (pair.settingsOpen !== false) ? { ...pair, settingsOpen: false } : pair)
}

/**
 * Disable/enable specified pair in the list of regex pairs
 *
 * If pair is "Disabled" it will not be used when matching/replacing
 * the input. It will however, be validated as normal
 *
 * @param {array}  pairs List of regex pair object
 * @param {string} id    UID for regex pair to be deleted
 *
 * @returns {array} list of regex pairs with the specified pair
 *                  disabled/enabled
 */
const togglePairSettings = (pairs, id, open) => {
  console.log('id:', id)
  console.log('open:', open)
  return pairs.map(pair => {
    if (pair.id === id) {
      if (pair.settingsOpen !== open) {
        return { ...pair, settingsOpen: open }
      }
    } else {
      if (pair.settingsOpen === true) {
        return { ...pair, settingsOpen: false }
      }
    }

    return pair
  })
}

//  END:  list helpers
// ----------------------------------------------

//  END:  Reducer helpers functions
// ==============================================
// START: Reducers

export const regexPairReducer = (state = [defaultPair], action = { type: 'default' }) => {
  switch (action.type) {
    case regexPairActions.UPDATE_REGEX:
      return updatePairRegex(
        state,
        action.payload.id,
        action.payload.value,
        action.payload.error
      )

    case regexPairActions.UPDATE_REPLACE:
      return updatePairReplace(
        state,
        action.payload.id,
        action.payload.value
      )

    case regexPairActions.UPDATE_FLAGS:
      return updatePairFlags(
        state,
        action.payload.id,
        action.payload.value,
        action.payload.error
      )

    case regexPairActions.UPDATE_DELIMS:
      return updatePairDelim(
        state,
        action.payload.id,
        action.payload.value,
        action.payload.isOpen,
        action.payload.error
      )

    case regexPairActions.MULTI_LINE:
      return updatePairMultiLine(
        state,
        action.payload
      )

    case regexPairActions.FULL_WIDTH:
      return updatePairFullWidth(
        state,
        action.payload
      )

    case regexPairActions.TRANSFORM_ESCAPED:
      return updatePairEscaped(
        state,
        action.payload
      )

    case regexPairActions.MOVE_UP:
      return movePairUp(state, action.payload)

    case regexPairActions.MOVE_DOWN:
      return movePairDown(state, action.payload)

    case regexPairActions.MOVE_TO:
      return movePairTo(
        state,
        action.payload.id,
        action.payload.value
      )

    case regexPairActions.ADD_BEFORE:
      return addPairBefore(state, action.payload)

    case regexPairActions.ADD_AFTER:
      return addPairAfter(state, action.payload)

    case regexPairActions.RESET:
      return resetPair(state, action.payload)

    case regexPairActions.DELETE:
      return deletePair(state, action.payload)

    case regexPairActions.DISABLE:
      return disablePair(state, action.payload)

    case regexPairActions.OPEN_SETTINGS:
      return togglePairSettings(state, action.payload, true)

    case regexPairActions.CLOSE_SETTINGS:
      return togglePairSettings(state, action.payload, false)

    case regexPairActions.SET_FOCUSED_ID:
      console.log('SET_FOCUSED_ID')
      console.log('action.payload:', action.payload)
      return closePairSettings(state, action.payload)

    default:
      return state
  }
}

export const regexUpdateChainReducer = (state = true, action = { type: 'default' }) => {
  if (action.type === oneOffActions.UPDATE_CHAIN && typeof action.payload === 'boolean') {
    return action.payload
  } else {
    return state
  }
}

export const regexSetEngineReducer = (state = 'vanillaJS', action = { type: 'default' }) => {
  if (action.type === oneOffActions.SET_ENGINE && typeof action.payload === 'string') {
    return action.payload
  } else {
    return state
  }
}

export const regexUpdateDefaultsReducer = (state = engineDefaults, action = { type: 'default' }) => {
  if (action.type === oneOffActions.UPDATE_DEFAULTS) {
    return action.payload
  } else {
    return state
  }
}

export const regexUpdateFocusedID = (state = '', action = { type: 'default' }) => {
  if (action.type === regexPairActions.SET_FOCUSED_ID) {
    return action.payload
  } else {
    return state
  }
}

export const regexRegisterEngineReducer = (state = [], action = { type: 'default' }) => {
  switch (action.type) {
    case oneOffActions.REGISTER_ENGINE:
      for (let a = 0; a < state.length; a += 1) {
        if (state[a].id === action.payload.id) {
          console.error('Cannot re-register "' + action.payload.label + '" (' + action.payload.id + ')')
        }
      }
      return [...state, action.payload]

    case oneOffActions.UPDATE_DEFAULTS:
      return state.map(engine => {
        if (engine.id === action.payload.engine) {
          return {
            ...engine,
            userDefaults: action.payload.defaults
          }
        } else {
          return engine
        }
      })

    default:
      return state
  }
}

export const regexSetMatchesReducer = (state = [], action = { type: 'default' }) => {
  if (action.type === oneOffActions.SET_MATCHES) {
    return action.payload
  } else {
    return state
  }
}

export const regexSetOutputReducer = (state = '', action = { type: 'default' }) => {
  if (action.type === oneOffActions.SET_OUTPUT && typeof action.payload === 'string') {
    return action.payload
  } else {
    return state
  }
}

export const regexSetScreenReducer = (state = '', action = { type: 'default' }) => {
  if (action.type === oneOffActions.SET_SCREEN && state !== action.payload) {
    switch (action.payload) {
      case 'output':
      case 'matches':
      case 'input':
      case 'regex':
        return action.payload

      default:
        if (typeof action.payload !== 'string') {
          throw Error('Cannot use ' + typeof action.payload + ' as a value for oneOff screen')
        } else {
          throw Error('Cannot set "' + action.payload + ' "as oneOff screen')
        }
    }
  } else {
    return state
  }
}

export const regexInputReducer = (state = defaultInput, action = { type: 'default' }) => {
  switch (action.type) {
    case oneOffActions.SET_INPUT:
      if (typeof action.payload === 'string') {
        return {
          ...state,
          raw: action.payload
        }
      } else {
        console.error('Invalid input value')
        break
      }

    case oneOffActions.SET_DO_SPLIT:
      console.log('state.split.doSplit:', state.split.doSplit)
      return {
        ...state,
        split: {
          ...state.split,
          doSplit: !state.split.doSplit
        }
      }

    case oneOffActions.SET_SPLITTER:
      if (typeof action.payload === 'string') {
        return {
          ...state,
          split: {
            ...state.split,
            splitter: action.payload
          }
        }
      } else {
        console.error('Splitter must be a string')
        break
      }

    case oneOffActions.SET_STRIP_BEFORE:
      return {
        ...state,
        strip: {
          ...state.strip,
          before: !state.strip.before
        }
      }

    case oneOffActions.SET_STRIP_AFTER:
      console.log(state,)
      return {
        ...state,
        strip: {
          ...state.strip,
          after: !state.strip.after
        }
      }

    case oneOffActions.TOGGLE_SETTINGS:
      console.log(state,)
      return {
        ...state,
        settingsOpen: !state.settingsOpen
      }

    default:
      return state
  }
}

export const oneOffReducer = combineReducers({
  input: regexInputReducer,
  regex: combineReducers({
    pairs: regexPairReducer,
    chain: regexUpdateChainReducer,
    engine: regexSetEngineReducer,
    defaults: regexUpdateDefaultsReducer,
    engines: regexRegisterEngineReducer,
    focusedID: regexUpdateFocusedID
  }),
  matches: regexSetMatchesReducer,
  output: regexSetOutputReducer,
  screen: regexSetScreenReducer
})

//  END:  Reducers
// ==============================================
