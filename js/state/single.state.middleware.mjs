import { regexPairActions, regexActions, regexInputActions } from './single.state.reducers.mjs'

// ==============================================
// START: Utility functions


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
export const getID = () => {
  let basicID = 0
  // slowPoke()
  basicID = Date.now()
  basicID = basicID.toString()
  return 'R' + basicID.substr(-9)
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

//  END:  Middleware functions
// ==============================================
