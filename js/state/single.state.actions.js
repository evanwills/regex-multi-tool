/**
 * List of actions that can be performed on individual regex pair
 * componenets in the list of regex pairs
 */
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
  RESET: 'REGEX_PAIR_RESET',
  DISABLE: 'REGEX_PAIR_DISABLE'
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
// `<BUTTON>`, `<INPUT>` & `<SELECT>` click/change action creators
// need to know the state of the field that was changed so these
// return normal (non-arrow) function that inherit the `this` context
// of the field that changed.

/**
 * Get a function that returns an action creator function that can
 * be used as an event handler for Regex Pair regulare expression
 * text input field
 *
 * @param {object} _dispatch Redux store dispatch function for
 *                           dispatching redux store actions
 *
 * @returns {function} A function that returns a Redux store
 *                     (self dispatching) action creator
 */
export const getAutoDispatchUpdateRegex = (_dispatch) => {
  return function (e) {
    _dispatch({
      type: regexPairActions.UPDATE_REGEX,
      payload: {
        id: this.dataset.id,
        value: this.value
      }
    })
  }
}

/**
 * Get a function that returns an action creator function that can
 * be used as an event handler for Regex Pair replacement pattern
 * text input field
 *
 * @param {object} _dispatch Redux store dispatch function for
 *                           dispatching redux store actions
 *
 * @returns {function} A function that returns a Redux store
 *                     (self dispatching) action creator
 */
export const getAutoDispatchUpdateReplace = (_dispatch) => {
  return function (e) {
    _dispatch({
      type: regexPairActions.UPDATE_REPLACE,
      payload: {
        id: this.dataset.id,
        value: this.value
      }
    })
  }
}

/**
 * Get a function that returns an action creator function that can
 * be used as an event handler for Regex Pair flags/modifiers
 * text input field
 *
 * @param {object} _dispatch Redux store dispatch function for
 *                           dispatching redux store actions
 *
 * @returns {function} A function that returns a Redux store
 *                     (self dispatching) action creator
 */
export const getAutoDispatchUpdateFlags = (_dispatch) => {
  return function (e) {
    _dispatch({
      type: regexPairActions.UPDATE_FLAGS,
      payload: {
        id: this.dataset.id,
        value: this.value
      }
    })
  }
}

/**
 * Get a function that returns an action creator function that can
 * be used as an event handler for Regex Pair the opening or closing
 * delimiter text fields
 *
 * @param {object} _dispatch Redux store dispatch function for
 *                           dispatching redux store actions
 *
 * @returns {function} A function that returns a Redux store
 *                     (self dispatching) action creator
 */
export const getAutoDispatchUpdateDelims = (_dispatch) => (_isOpen) => {
  return function (e) {
    _dispatch({
      type: regexPairActions.UPDATE_DELIMS,
      payload: {
        id: this.dataset.id,
        value: this.value,
        isOpen: _isOpen
      }
    })
  }
}

/**
 * Get a function that returns an action creator function that can
 * be used as an event handler for Regex Pair the "Multi line"
 * checkbox field
 *
 * @param {object} _dispatch Redux store dispatch function for
 *                           dispatching redux store actions
 *
 * @returns {function} A function that returns a Redux store
 *                     (self dispatching) action creator
 */
export const getAutoDispatchUpdateMultiLine = (_dispatch) => {
  return function (e) {
    _dispatch({
      type: regexPairActions.MULTI_LINE,
      payload: {
        id: this.value,
        value: this.checked
      }
    })
  }
}

/**
 * Get a function that returns an action creator function that can
 * be used as an event handler for Regex Pair the "Transform escapsed"
 * checkbox field
 *
 * @param {object} _dispatch Redux store dispatch function for
 *                           dispatching redux store actions
 *
 * @returns {function} A function that returns a Redux store
 *                     (self dispatching) action creator
 */
export const getAutoDispatchUpdateEscaped = (_dispatch) => {
  return function (e) {
    _dispatch({
      type: regexPairActions.TRANSFORM_ESCAPED,
      payload: {
        id: this.value,
        value: this.checked
      }
    })
  }
}

/**
 * Get a function that returns an action creator function that can
 * be used as an event handler for Regex Pair "Move to" select field
 * change events
 *
 * @param {object} _dispatch Redux store dispatch function for
 *                           dispatching redux store actions
 *
 * @returns {function} A function that returns a Redux store
 *                     (self dispatching) action creator
 */
export const getAutoDispatchPairMoveTo = (_dispatch) => {
  return function (e) {
    _dispatch({
      type: regexPairActions.MOVE_TO,
      payload: {
        id: this.dataset.id,
        value: this.value
      }
    })
  }
}

/**
 * Get a function that returns an action creator function that can
 * be used as an event handler for Regex Pair button clicks
 *
 * @param {object} _dispatch Redux store dispatch function for
 *                           dispatching redux store actions
 * @param {string} prop      A property name of the regexPairActions
 *                           object
 *
 * @returns {function} A function that returns a Redux store
 *                     (self dispatching) action creator
 */
export const getAutoDispatchPairBtn = (_dispatch) => (prop) => {
  if (typeof field !== 'string') {
    throw Error('getAutoDispatchPairBtn() expects second param field to be a string. "' + typeof field + '" given')
  }
  const _prop = prop.toUpperCase()
  const boolProps = [
    'MOVE_UP', 'MOVE_DOWN',
    'ADD_BEFORE', 'ADD_AFTER',
    'DELETE', 'RESET', 'DISABLE'
  ]

  if (boolProps.indexOf(_prop) > -1) {
    return function (e) {
      _dispatch({
        type: regexPairActions[_prop],
        payload: this.value
      })
    }
  }

  throw Error('getAutoDispatchPairBtn() expects second param field to be the name of one of the boolean Regex Pair Actions')
}

export const getAutoDispatchSetMatches = (_dispatch) => (e) => {
  _dispatch({
    type: regexActions.SET_MATCHES,
    payload: []
  })
}

export const getAutoDispatchSetOutput = (_dispatch) => (e) => {
  _dispatch({
    type: regexActions.SET_OUTPUT,
    payload: ''
  })
}

export const getAutoDispatchSetEngine = (_dispatch) => {
  return function (e) {
    _dispatch({
      type: regexActions.SET_ENGINE,
      payload: this.value
    })
  }
}

export const getAutoDispatchSetInput = (_dispatch) => {
  return function (e) {
    _dispatch({
      type: regexInputActions.SET_INPUT,
      payload: this.value
    })
  }
}

export const getAutoDispatchSetDoSplit = (_dispatch) => {
  return function (e) {
    _dispatch({
      type: regexInputActions.SET_DO_SPLIT,
      payload: this.checked
    })
  }
}

export const getAutoDispatchSetSplitter = (_dispatch) => {
  return function (e) {
    _dispatch({
      type: regexInputActions.SET_SPLITTER,
      payload: this.value
    })
  }
}

export const getAutoDispatchSetStripBefore = (_dispatch) => (_before) => {
  const _actionType = (_before === true) ? regexInputActions.SET_STRIP_BEFORE : regexInputActions.SET_STRIP_AFTER

  return function (e) {
    _dispatch({
      type: _actionType,
      payload: this.checked
    })
  }
}

//  END:  Action creators
// ==============================================
