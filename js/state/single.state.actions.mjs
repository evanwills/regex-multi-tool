
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
