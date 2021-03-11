/**
 * List of actions that can be performed on individual regex pair
 * componenets in the list of regex pairs
 *
 * @constant {object} regexPairActions
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
  DISABLE: 'REGEX_PAIR_DISABLE',
  SET_AS_DEFAULT: 'REGEX_SET_AS_DEFAULT',
  SETTINGS_TOGGLE: 'REGEX_SETTINGS_TOGGLE',
  SET_FOCUSED_ID: 'REGEX_SET_FOCUSED_ID'
}

export const oneOffActions = {
  UPDATE_CHAIN: 'ONEOFF_UPDATE_CHAIN',
  SET_ENGINE: 'ONEOFF_SET_ENGINE',
  UPDATE_DEFAULTS: 'ONEOFF_UPDATE_ENGINE_DEFAULTS',
  REGISTER_ENGINE: 'ONEOFF_REGISTER_ENGINE',
  SET_MATCHES: 'ONEOFF_SET_MATCHES',
  SET_OUTPUT: 'ONEOFF_SET_OUTPUT',
  RESET: 'ONEOFF_RESET_ALL',
  // input related actions
  SET_INPUT: 'ONEOFF_INPUT_SET_RAW',
  SET_DO_SPLIT: 'ONEOFF_INPUT_SET_DO_SPLIT',
  SET_SPLITTER: 'ONEOFF_INPUT_SET_SPLITTER',
  SET_STRIP_BEFORE: 'ONEOFF_INPUT_SET_STRIP_BEFORE',
  SET_STRIP_AFTER: 'ONEOFF_INPUT_SET_STRIP_AFTER'
}

// ==============================================
// START: Action creators

const getActionMeta = (input) => {
  if (input.match(/^R[0-9]{9}-[a-zA-Z]+(?:-[a-zA-Z]+)?$/)) {
    const _val = input.split('-')

    return {
      id: _val[0].trim(),
      type: _val[1].trim(),
      extra: (typeof _val[2] === 'string') ? _val[2].trim() : ''
    }
  } else {
    throw Error('The input must match a regex pair ID plus the primary action type and optionally an action type modifier')
  }
}

// The following set of functions return self-dispatching action
// creators functions
//
// `<BUTTON>`, `<INPUT>` & `<SELECT>` click/change action creators
// need to know the state of the field that was changed so these
// return normal (non-arrow) function that inherit the `this` context
// of the field that changed.

/**
 * Get a function to be used as an event handler, that can be shared
 * across all simple events (checkbox changes and button clicks)
 * across all regex pairs.
 *
 * @param {object} _dispatch Redux store dispatch function for
 *                           dispatching redux store actions
 *
 * @returns {function} A function that returns a Redux store
 *                     (self dispatching) action creator
 */
export const getAutoDispatchOneOffPairSimpleEvent = (_dispatch) => {
  return function (e) {
    const _meta = getActionMeta(this.value)
    let _type = ''

    switch (_meta.type) {
      case 'multiLine':
        _type = regexPairActions.MULTI_LINE
        break

      case 'whiteSpace':
        _type = regexPairActions.TRANSFORM_ESCAPED
        break

      case 'delete':
        _type = regexPairActions.DELETE
        break

      case 'reset':
        _type = regexPairActions.RESET
        break

      case 'disable':
        _type = regexPairActions.DISABLE
        break

      case 'setDefault':
        _type = regexPairActions.SET_AS_DEFAULT
        break

      case 'toggleSettings':
        _type = regexPairActions.SETTINGS_TOGGLE
        break

      case 'add':
        if (_meta.extra === 'before' || _meta.extra === 'after') {
          _type = (_meta.extra === 'before')
            ? regexPairActions.ADD_BEFORE
            : regexPairActions.ADD_AFTER
        } else {
          throw Error('Could not determin whether "Add" button click applies to "Add Before" or "Add After" from "' + this.value + '"')
        }
        break

      case 'move':
        if (_meta.extra === 'up' || _meta.extra === 'down') {
          _type = (_meta.extra === 'up')
            ? regexPairActions.MOVE_UP
            : regexPairActions.MOVE_DOWN
        } else {
          throw Error('Could not determin whether "Move" button click applies to "Move Up" or "Move Down" from "' + this.value + '"')
        }
        break
    }

    _dispatch({
      type: _type,
      payload: _meta.id
    })
  }
}

/**
 * Get a function to be used as an event handler, that can be shared
 * across all value events (text and select changes) across all regex
 * pairs.
 *
 * @param {object} _dispatch Redux store dispatch function for
 *                           dispatching redux store actions
 *
 * @returns {function} A function that returns a Redux store
 *                     (self dispatching) action creator
 */
export const getAutoDispatchOneOffPairValueEvent = (_dispatch) => {
  return function (e) {
    const _meta = getActionMeta(this.id)
    let _type = ''
    let _isOpen = null
    const _output = {
      type: null,
      payload: {
        id: _meta.id,
        value: this.value
      }
    }

    switch (_meta.type) {
      case 'regex':
        _type = regexPairActions.UPDATE_REGEX
        break

      case 'flags':
        _type = regexPairActions.UPDATE_FLAGS
        break

      case 'replace':
        _type = regexPairActions.UPDATE_REPLACE
        break

      case 'delims':
        _type = regexPairActions.UPDATE_DELIMS
        if (_meta.extra === 'open' || _meta.extra === 'close') {
          _isOpen = (_meta.extra === 'open')
        } else {
          throw Error('Could not determine whether the Opening or Closing delimiter is to be updated from "' + this.id + '"')
        }
        break

      case 'moveTo':
        _type = regexPairActions.MOVE_TO
        break
    }

    if (_type !== '') {
      _output.type = _type
      if (_isOpen !== null) {
        _output.payload.isOpen = _isOpen
      }

      _dispatch(_output)
    } else {
      throw Error('Could not determine a valid action type from "' + this.id + '"')
    }
  }
}


/**
 * Get a function to be used as an event handler, that can be shared
 * across all value events (text, radio and select changes) across
 * all general oneOff interface fields (but not regex pair events).
 *
 * @param {object} _dispatch Redux store dispatch function for
 *                           dispatching redux store actions
 *
 * @returns {function} A function that returns a Redux store
 *                     (self dispatching) action creator
 */
export const getAutoDispatchOneOffValueEvent = (_dispatch) => {
  return function (e) {
    let _type = ''

    switch (this.id) {
      case 'setEngine':
        _type = oneOffActions.SET_ENGINE
        break

      case 'setInput':
        _type = oneOffActions.SET_INPUT
        break

      case 'setSplitter':
        _type = oneOffActions.SET_SPLITTER
        break
    }

    _dispatch({
      type: _type,
      payload: this.value
    })
  }
}

/**
 * Get a function to be used as an event handler, that can be shared
 * across all simple events (checkbox changes and button clicks)
 * across all general oneOff interface fields (but not regex pair
 * events).
 *
 * @param {object} _dispatch Redux store dispatch function for
 *                           dispatching redux store actions
 *
 * @returns {function} A function that returns a Redux store
 *                     (self dispatching) action creator that can be used as an event handler
 */
export const getAutoDipatchOneOffSimpleEvent = (_dispatch) => {
  return function (e) {
    let _type = ''

    switch (this.value) {
      case 'updateChain':
        _type = oneOffActions.UPDATE_CHAIN
        break

      case 'setOutput':
        _type = oneOffActions.SET_OUTPUT
        break

      case 'setMatches':
        _type = oneOffActions.SET_MATCHES
        break

      case 'reset':
        _type = oneOffActions.RESET
        break

      case 'setDoSplit':
        _type = oneOffActions.SET_DO_SPLIT
        break

      case 'setStrip-before':
        _type = oneOffActions.SET_STRIP_BEFORE
        break

      case 'setStrip-after':
        _type = oneOffActions.SET_STRIP_AFTER
        break
    }

    _dispatch({
      type: _type
    })
  }
}

export const registerOneOffEngine = (_dispatch) => (_engine) => {
  _dispatch({
    type: oneOffActions.REGEX_REGISTER_ENGINE,
    payload: _engine
  })
}

//  END:  Action creators
// ==============================================