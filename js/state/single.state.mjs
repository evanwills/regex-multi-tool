
export const regexPairActions = {
  UPDATE_REGEX: 'REGEX_PAIR_UPDATE_REGEX',
  UPDATE_REPLACE: 'REGEX_PAIR_UPDATE_REPLACE',
  UPDATE_FLAGS: 'REGEX_PAIR_UPDATE_FLAGS',
  UPDATE_DELIMS: 'REGEX_PAIR_UPDATE_DELIMS',
  MULTI_LINE: 'REGEX_PAIR_SET_MULTI_LINE',
  TRANSFORM_ESCAPED: 'REGEX_PAIR_SET_TRANSFORM_ESCAPED',
  MOVE_UP: 'REGEX_PAIR_MOVE_UP',
  MOVE_DOWN: 'REGEX_PAIR_MOVE_DOWN',
  MOVE_TO: 'REGEX_PAIR_MOVE_TO',
  ADD_BEFORE: 'REGEX_PAIR_ADD_BEFORE',
  ADD_AFTER: 'REGEX_PAIR_ADD_AFTER',
  DELETE: 'REGEX_PAIR_DELETE',
  RESET: 'REGEX_PAIR_RESET'
}

export const regexActions = {
  UPDATE_CHAIN: 'REGEX_UPDATE_CHAIN',
  SET_ENGINE: 'REGEX_SET_ENGINE',
  UPDATE_DEFAULTS: 'REGEX_UPDATE_ENGINE_DEFAULTS',
  REGISTER_ENGINE: 'REGEX_REGISTER_ENGINE',
  SET_MATCHES: 'REGEX_SET_MATCHES',
  SET_OUTPUT: 'REGEX_SET_OUTPUT'
}

export const regexInputActions = {
  SET_INPUT: 'REGEX_INPUT_SET_RAW',
  SET_DO_SPLIT: 'REGEX_INPUT_SET_DO_SPLIT',
  SET_SPLITTER: 'REGEX_INPUT_SET_SPLITTER',
  SET_STRIP_BEFORE: 'REGEX_INPUT_SET_STRIP_BEFORE',
  SET_STRIP_AFTER: 'REGEX_INPUT_SET_STRIP_AFTER'
}

// ==============================================
// START: Utility functions

/**
 * Use up a couple of milliseconds worth of CPU time to ensure
 * UID is unique
 *
 * @returns {void}
 */
const slowPoke = () => {
  console.groupCollapsed('slowPoke()')
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.log(Math.sqrt(Date.now() * Math.PI))
  console.groupEnd()
}

/**
 * Get a unique ID for each regex pair
 *
 * ID is the last nine digits of JS timestamp prefixed with the
 * letter "R"
 *
 * NOTE: The number just short of 1 billion milliseconds
 *       or rougly equivalent to 11.5 days
 *
 * @returns {string}
 */
const getID = () => {
  let basicID = 0
  // slowPoke()
  basicID = Date.now()
  basicID = basicID.toString()
  return 'R' + basicID.substr(-9)
}

/**
 * Clone regex pair. Give it a new ID and reset the regex and
 * replace patterns
 *
 * @param {object} oldPair Existing regex pair object to be cloned
 *
 * @returns {object} cloned version of supplied regex pair object
 */
const clonePair = (oldPair) => {
  return {
    ...oldPair,
    id: getID(),
    pos: 0,
    count: 0,
    regex: { pattern: '', error: '' },
    replace: ''
  }
}

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
        pair: clonePair(pairs[a]),
        pos: a
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

const defaultPair = {
  pos: 1,
  count: 1,
  id: getID(),
  regex: {
    pattern: '',
    error: ''
  },
  replace: '',
  flags: 'ig',
  delimiters: {
    open: '',
    close: '',
    error: ''
  },
  hasError: '',
  multiLine: false,
  transformEscaped: true
}

const engineDefaults = {
  engine: 'vanillaJS',
  flags: 'ig',
  delimiters: {
    open: '',
    close: ''
  },
  multiLine: false,
  transformEscaped: true
}

const defaultInput = {
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
const updatePairEscaped = (pairs, id, value) => {
  return pairs.map((pair) => {
    if (pair.id === id) {
      return {
        ...pair,
        transformEscaped: value
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
const updatePairMultiLine = (pairs, id, value) => {
  return pairs.map((pair) => {
    if (pair.id === id) {
      return {
        ...pair,
        multiLine: value
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
const addPairBefore = (pairs, id) => {
  const newPair = getNewPairAndPos(pairs, id)
  if (newPair.pos > -1) {
    const newPairs = [...pairs]

    newPairs.splice(newPair.pos, 0, newPair.pair)

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
const addPairAfter = (pairs, id) => {
  const newPair = getNewPairAndPos(pairs, id)
  if (newPair.pos > -1) {
    const newPairs = [...pairs]

    newPairs.splice(newPair.pos + 1, 0, newPair.pair)

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

//  END:  list helpers
// ----------------------------------------------

//  END:  Reducer helpers functions
// ==============================================
// START: Reducers

export const regexPairsReducer = (state = [defaultPair], action = { type: 'default' }) => {
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
        action.payload.id,
        action.payload.value
      )

    case regexPairActions.TRANSFORM_ESCAPED:
      return updatePairEscaped(
        state,
        action.payload.id,
        action.payload.value
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

    default:
      return state
  }
}

export const regexUpdateChainReducer = (state = true, action = { type: 'default' }) => {
  if (action.type === regexActions.UPDATE_CHAIN && typeof action.payload === 'boolean') {
    return action.payload
  } else {
    return state
  }
}

export const regexSetEngineReducer = (state = 'vanillaJS', action = { type: 'default' }) => {
  if (action.type === regexActions.SET_ENGINE && typeof action.payload === 'string') {
    return action.payload
  } else {
    return state
  }
}

export const regexUpdateDefaultsReducer = (state = engineDefaults, action = { type: 'default' }) => {
  if (action.type === regexActions.UPDATE_DEFAULTS) {
    return action.payload
  } else {
    return state
  }
}

export const regexRegisterEngineReducer = (state = [], action = { type: 'default' }) => {
  switch (action.type) {
    case regexActions.REGISTER_ENGINE:
      for (let a = 0; a < state.length; a += 1) {
        if (state[a].id === action.payload.id) {
          console.error('Cannot re-register "' + action.payload.label + '" (' + action.payload.id + ')')
        }
      }
      return [...state, action.payload]

    case regexActions.UPDATE_DEFAULTS:
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
  if (action.type === regexActions.SET_MATCHES) {
    return action.payload
  } else {
    return state
  }
}

export const regexSetOutputReducer = (state = '', action = { type: 'default' }) => {
  if (action.type === regexActions.SET_OUTPUT && typeof action.payload === 'string') {
    return action.payload
  } else {
    return state
  }
}

export const regexInputReducer = (state = defaultInput, action = { type: 'default' }) => {
  switch (action.type) {
    case regexInputActions.SET_INPUT:
      if (typeof action.payload === 'string') {
        return {
          ...state,
          raw: action.payload
        }
      } else {
        console.error('Invalid input value')
        break
      }

    case regexInputActions.SET_DO_SPLIT:
      if (typeof action.payload === 'boolean') {
        return {
          ...state,
          split: {
            ...state.split,
            doSplit: action.payload
          }
        }
      } else {
        console.error('Invalid state for doSplit')
        break
      }

    case regexInputActions.SET_SPLITTER:
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

    case regexInputActions.SET_STRIP_BEFORE:
      if (typeof action.payload === 'boolean') {
        return {
          ...state,
          strip: {
            ...state.strip,
            before: action.payload
          }
        }
      } else {
        console.error('Invalid state for split before')
        break
      }

    case regexInputActions.SET_STRIP_AFTER:
      if (typeof action.payload === 'boolean') {
        return {
          ...state,
          strip: {
            ...state.strip,
            after: action.payload
          }
        }
      } else {
        console.error('Invalid state for split before')
        break
      }

    default:
      return state
  }
}

//  END:  Reducers
// ==============================================
// START: Action creators

// The following set of functions return self-dispatching action
// creators functions
//
// For button click action creators they are pure higher order arrow
// fuctions because they do not need to know about the state of the
// button that was clicked.
//
// <INPUT> & <SELECT> change action creators need to know the state
// of the field that was changed so these return normal (non-arrow)
// function that inherit the `this` context of the field that
// changed.

/**
 *
 * @param _store Redux store object
 */
export const dispatchUpdatePairRegex = (_store) => (_id) => {
  return function (e) {
    _store.dispatch({
      type: regexPairActions.UPDATE_REGEX,
      payload: {
        id: _id,
        value: this.value
      }
    })
  }
}

export const dispatchUpdatePairReplace = (_store) => (_id) => {
  return function (e) {
    _store.dispatch({
      type: regexPairActions.UPDATE_REPLACE,
      payload: {
        id: _id,
        value: this.value
      }
    })
  }
}

export const dispatchUpdatePairFlags = (_store) => (_id) => {
  return function (e) {
    _store.dispatch({
      type: regexPairActions.UPDATE_FLAGS,
      payload: {
        id: _id,
        value: this.value
      }
    })
  }
}

export const dispatchUpdatePairDelims = (_store) => (_id, _isOpen) => {
  return function (e) {
    _store.dispatch({
      type: regexPairActions.UPDATE_DELIMS,
      payload: {
        id: _id,
        value: this.value,
        isOpen: _isOpen
      }
    })
  }
}

export const dispatchUpdatePairMultiLine = (_store) => (_id) => {
  return function (e) {
    _store.dispatch({
      type: regexPairActions.MULTI_LINE,
      payload: {
        id: _id,
        value: this.checked
      }
    })
  }
}

export const dispatchUpdatePairEscaped = (_store) => (_id) => {
  return function (e) {
    _store.dispatch({
      type: regexPairActions.TRANSFORM_ESCAPED,
      payload: {
        id: _id,
        value: this.checked
      }
    })
  }
}

export const dispatchMovePairUpDown = (_store) => (_id, _up) => (e) => {
  const _actionType = (_up === true) ? regexPairActions.MOVE_UP : regexPairActions.MOVE_DOWN

  return (e) => {
    _store.dispatch({
      type: _actionType,
      payload: _id
    })
  }
}

export const dispatchPairMoveTo = (_store) => (_id) => {
  return function (e) {
    _store.dispatch({
      type: regexPairActions.MOVE_TO,
      payload: {
        id: _id,
        value: this.value
      }
    })
  }
}

export const dispatchAddPairBeforeAfter = (_store) => (_id, _before) => {
  const _actionType = (_before === true) ? regexPairActions.ADD_BEFORE : regexPairActions.ADD_AFTER

  return (e) => {
    _store.dispatch({
      type: _actionType,
      payload: _id
    })
  }
}

export const dispatchResetRegexPair = (_store) => (_id) => (e) => {
  _store.dispatch({
    type: regexPairActions.RESET,
    payload: _id
  })
}

export const dispatchDeleteRegexPair = (_store) => (_id) => (e) => {
  _store.dispatch({
    type: regexPairActions.DELETE,
    payload: _id
  })
}

export const dispatchSetMatches = (_store) => (e) => {
  _store.dispatch({
    type: regexActions.SET_MATCHES,
    payload: []
  })
}

export const dispatchSetOutput = (_store) => (e) => {
  _store.dispatch({
    type: regexActions.SET_OUTPUT,
    payload: ''
  })
}

export const dispatchSetEngine = (_store) => (_id) => {
  return function (e) {
    _store.dispatch({
      type: regexActions.SET_ENGINE,
      payload: this.value
    })
  }
}

export const dispatchSetInput = (_store) => (_id) => {
  return function (e) {
    _store.dispatch({
      type: regexInputActions.SET_INPUT,
      payload: this.value
    })
  }
}

export const dispatchSetDoSplit = (_store) => (_id) => {
  return function (e) {
    _store.dispatch({
      type: regexInputActions.SET_DO_SPLIT,
      payload: this.checked
    })
  }
}

export const dispatchSetSplitter = (_store) => (_id) => {
  return function (e) {
    _store.dispatch({
      type: regexInputActions.SET_SPLITTER,
      payload: this.value
    })
  }
}

export const dispatchSetStripBefore = (_store) => (_id, _before) => {
  const _actionType = (_before === true) ? regexInputActions.SET_STRIP_BEFORE : regexInputActions.SET_STRIP_AFTER

  return function (e) {
    _store.dispatch({
      type: _actionType,
      payload: this.checked
    })
  }
}

//  END:  Action creators
// ==============================================
