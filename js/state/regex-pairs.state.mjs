
export const regexPairActions = {
  UPDATE_REGEX: 'PAIR_UPDATE_REGEX',
  UPDATE_REPLACE: 'PAIR_UPDATE_REPLACE',
  UPDATE_FLAGS: 'PAIR_UPDATE_FLAGS',
  UPDATE_DELIMS: 'PAIR_UPDATE_DELIMS',
  MULTI_LINE: 'PAIR_SET_MULTI_LINE',
  TRANSFORM_ESCAPED: 'PAIR_SET_TRANSFORM_ESCAPED',
  MOVE_UP: 'PAIR_MOVE_UP',
  MOVE_DOWN: 'PAIR_MOVE_DOWN',
  MOVE_TO: 'PAIR_MOVE_TO',
  ADD_BEFORE: 'PAIR_ADD_BEFORE',
  ADD_AFTER: 'PAIR_ADD_AFTER',
  DELETE: 'PAIR_DELETE',
  RESET: 'PAIR_RESET'
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
// START: Reducer

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
      return movePairUp(state, action.payload.id)

    case regexPairActions.MOVE_DOWN:
      return movePairDown(state, action.payload.id)

    case regexPairActions.MOVE_TO:
      return movePairTo(
        state,
        action.payload.id,
        action.payload.value
      )

    case regexPairActions.ADD_BEFORE:
      return addPairBefore(state, action.payload.id)

    case regexPairActions.ADD_AFTER:
      return addPairAfter(state, action.payload.id)

    case regexPairActions.RESET:
      return resetPair(state, action.payload.id)

    case regexPairActions.DELETE:
      return deletePair(state, action.payload.id)

    default:
      return state
  }
}

//  END:  Reducer
// ==============================================
