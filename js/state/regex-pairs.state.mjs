import e from "express"

export const regexPairActions = {
  MOVE_UP: 'PAIR_MOVE_UP',
  MOVE_DOWN: 'PAIR_MOVE_DOWN',
  ADD_BEFORE: 'PAIR_ADD_BEFORE',
  ADD_AFTER: 'PAIR_ADD_AFTER',
  DELETE: 'PAIR_DELETE',
  RESET: 'PAIR_RESET',
  MULTI_LINE: 'PAIR_MULTI_LINE',
  TRANSFORM_ESCAPED: 'PAIR_TRANSFORM_ESCAPED',
  UPDATE_FLAGS: 'PAIR_UPDATE_FLAGS',
  UPDATE_DELIMS: 'PAIR_UPDATE_DELIMS',
  UPDATE_REGEX: 'PAIR_UPDATE_REGEX',
  UPDATE_REPLACE: 'PAIR_UPDATE_REPLACE'
}

/**
 * Get a unique ID for each regex pair
 *
 * ID is the last nine digits of JS timestamp (just short of
 * 1 billion milliseconds) prefixed with the letter "R"
 *
 * @returns {string}
 */
const getID = () => {
  let basicID = Date.now()
  basicID = basicID.toString()
  return 'R' + basicID.substr(-9)
}

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

const movePairUp = (pairs, id) => {
  const sortedPairs = [...pairs]
  let moved = false

  sortedPairs.sort((a, b) => {
    return (moved === false && a.id === id) ? -1 : 0
  })

  return updatePos(sortedPairs)
}

const movePairDown = (pairs, id) => {
  const sortedPairs = [...pairs]
  let moved = false

  sortedPairs.sort((a, b) => {
    return (moved === false && a.id === id) ? 1 : 0
  })

  return updatePos(sortedPairs)
}

const getNewPairAndPos = (pairs, id) => {
  let newPair = {}
  let pos = -1

  for (let a = 0; a < pairs.length; a += 1) {
    if (pairs[a].id === id) {
      newPair = clonePair(pairs[a])
      pos = a
    }
  }

  return {
    pair: newPair,
    pos: pos
  }
}

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

const resetPair = (pairs, id) => {
  return updatePos(pairs.map(pair => {
    return (pair.id === id) ? clonePair(pair) : pair
  }))
}

const deletPair = (pairs, id) => {
  return updatePos(pairs.filter(pair => (pair.id !== id)))
}

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

const setHasError = (pair) => {
  return {
    ...pair,
    hasError: (pair.regex.error !== '' || pair.flags.error !== '' || pair.delimiters.error !== '')
  }
}

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

const updatePairDelims = (pairs, id, value, open, error) => {
  return pairs.map((pair) => {
    if (pair.id === id) {
      const _flags = {
        ...pair.flags,
        error: error
      }
      if (open === true) {
        _flags.open = value
      } else {
        _flags.close = value
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


export const regexPairsReducer = (state, action) => {
  switch (action.type) {
    case regexPairActions.MOVE_UP:
      return movePairUp(state, action.body.id)

    case regexPairActions.MOVE_DOWN:
      return movePairDown(state, action.body.id)

    case regexPairActions.ADD_BEFORE:
      return addPairBefore(state, action.body.id)

    case regexPairActions.ADD_AFTER:
      return addPairAfter(state, action.body.id)

    case regexPairActions.DELETE:
      return deletPair(state, action.body.id)

    case regexPairActions.RESET:
      return resetPair(state, action.body.id)

    case regexPairActions.MULTI_LINE:
      return updatePairMultiLine(
        state,
        action.body.id,
        action.body.value
      )

    case regexPairActions.TRANSFORM_ESCAPED:
      return updatePairEscaped(
        state,
        action.body.id,
        action.body.value
      )

    case regexPairActions.UPDATE_FLAGS:
      return updatePairFlags(
        state,
        action.body.id,
        action.body.value,
        action.body.error
      )

    case regexPairActions.UPDATE_DELIMS:
      return updatePairDelims(
        state,
        action.body.id,
        action.body.value,
        action.body.isOpen,
        action.body.error
      )

    case regexPairActions.UPDATE_REGEX:
      return updatePairRegex(
        state,
        action.body.id,
        action.body.value,
        action.body.error
      )

      case regexPairActions.UPDATE_REPLACE:
      return updatePairReplace(
        state,
        action.body.id,
        action.body.value
      )

    default:
      return state
    }
  }
}
