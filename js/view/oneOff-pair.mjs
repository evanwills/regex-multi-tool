import { html } from '../lit-html/lit-html.mjs'
import { getID } from '../state/utils.mjs'
import {
  getAutoDispatchUpdateRegex,
  getAutoDispatchUpdateReplace,
  getAutoDispatchUpdateFlags,
  getAutoDispatchUpdateDelims,
  getAutoDispatchUpdateMultiLine,
  getAutoDispatchUpdateEscaped,
  getAutoDispatchPairMoveTo,
  getAutoDispatchPairBtn
} from '../state/oneOff.state.actions'

// ============================================
// START: non-view functions

export const getNewPair = (_defaults) => {
  let _delims = null
  let _flags = ''
  let _multi = false
  let _escape = true

  if (typeof _defaults !== 'undefined') {
    if (typeof _defaults.delims !== 'undefined' && typeof _defaults.delims.open === 'string' && typeof _defaults.delims.close === 'string') {
      _delims = {
        open: _defaults.delims.open,
        close: _defaults.delims.close,
        errors: ''
      }
    }

    if (typeof _defaults.flags === 'string') {
      _flags = _defaults.flags
    }

    if (typeof _defaults.multiLine === 'boolean') {
      _multi = _defaults.multiLine
    }

    if (typeof _defaults.transformEscaped === 'boolean') {
      _escape = _defaults.transformEscaped
    }
  }

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
      flags: _flags,
      error: ''
    },
    delimiters: _delims,
    hasError: false,
    multiLine: _multi,
    transformEscaped: _escape
  }
}

//  END:  non-view functions
// ===================================================================
// START: sub views

const hiddenPos = (pos) => html`<span class="sr-only">number ${pos}</span>`

/**
 * Get a Select input to trigger moving the specified regex
 * pair component to a specific position in the list.
 *
 * NOTE: If the pair is the only one in the list then an empty
 *       string will be returned.
 *
 * @param {string}   id         ID of the regex pair being rendered
 * @param {number}   count      Total number of regex pairs in the
 *                              list
 * @param {number}   pos        Position of regex pair in list of
 *                              regex pairs
 * @param {function} _getClick  A function that returns the
 *                              appropriate event handler for the
 *                              button (that automatically dispatches
 *                              an action to the redux store)
 *
 * @returns {lit-html} render function
 */
const moveTo = (id, count, pos, _change) => {
  if (count < 2) {
    return ''
  }
  const _id = id + '-moveTo'
  const options = []
  for (let a = 1; a < count; a += 1) {
    const _dir = (a < pos) ? 'up' : 'down'
    options.push((a !== pos)
      ? html`<option value="${a}" title="Move ${_dir} to position ${a}">${a}</option>`
      : html`<option value="" title="current position (${a})" selected="selected"></option>`
    )
  }

  return html`
    <li>
      <label for="${_id}">Move ${hiddenPos(pos)} to</label>
      <select id="${_id}" data-id="${id}" @change=${_change}>
        ${options.map(option => option)}
      </select>
    </li>
  `
}

/**
 * Get a button to trigger disabling/enabling the specified regex
 * pair component
 *
 * NOTE: If the pair is the only one in the list then an empty
 *       string will be returned.
 *
 * @param {string}   id         ID of the regex pair being rendered
 * @param {number}   count      Total number of regex pairs in the
 *                              list
 * @param {boolean}  isDisabled Whether or not the pair is already
 *                              disabled
 * @param {number}   pos        Position of regex pair in list of
 *                              regex pairs
 * @param {function} _getClick  A function that returns the
 *                              appropriate event handler for the
 *                              button (that automatically dispatches
 *                              an action to the redux store)
 *
 * @returns {lit-html} render function
 */
const disableBtn = (id, count, isDisabled, pos, _getClick) => {
  const _mode = (isDisabled) ? 'Enable' : 'Disable'

  return (count > 1)
    ? html`
      <button value="${id}-disable" class="regex-pair__btn regex-pair__btn--${_mode.toLocaleLowerCase()}" @click=${_getClick('disable')} title="${_mode} this regex pair">
        ${_mode} ${hiddenPos(pos)}
      </button>`
    : ''
}

/**
 * Get a button to trigger deleting the specified regex pair
 * component
 *
 * NOTE: If the pair is the only one in the list then an empty string
 *       will be returned.
 *
 * @param {string}   id        ID of the regex pair being rendered
 * @param {number}   count     Total number of regex pairs in the
 *                             list
 * @param {number}   pos       Position of regex pair in list of
 *                             regex pairs
 * @param {function} _getClick A function that returns the
 *                             appropriate event handler for the
 *                             button (that automatically dispatches
 *                             an action to the redux store)
 *
 * @returns {lit-html} render function
 */
const deleteBtn = (id, count, pos, _getClick) => {
  return (count > 1)
    ? html`
      <button value="${id}-delete" class="regex-pair__btn regex-pair__btn--delete" @click=${_getClick('delete')} title="Delete this regex pair">
        Delete ${hiddenPos(pos)}
      </button>`
    : ''
}

/**
 * Get a button to trigger moving the specified regex pair component
 * up or down in the list
 *
 * NOTE: If the pair is the only one in the list then an empty string
 *       will be returned.
 *       If an "Up" button is requested and the pair is already first
 *       in the list then an empty string will be returned. Likewise,
 *       if "Down" is requested and the pair is already last, an empty
 *       string will also be returned.
 *
 * @param {string}   id        ID of the regex pair being rendered
 * @param {number}   count     Total number of regex pairs in the
 *                             list
 * @param {number}   pos       Position of regex pair in list of
 *                             regex pairs
 * @param {string}   _dir      Either "up" or "down"
 * @param {function} _getClick A function that returns the
 *                             appropriate event handler for the
 *                             button (that automatically dispatches
 *                             an action to the redux store)
 *
 * @returns {lit-html} render function
 */
const movePair = (id, count, pos, _dir, _getClick) => {
  let _newPos = -1

  if (typeof _dir !== 'string' || (_dir !== 'up' && _dir !== 'down')) {
    throw Error('movePair() expects fourth param _dir to be either "up" or "down"')
  }

  if (count === 1) {
    return ''
  }

  if (_dir === 'up') {
    if (pos === count) {
      return ''
    }
    _newPos = pos - 1
  } else {
    if (pos === 1) {
      return ''
    }
    _newPos = pos + 1
  }

  return html`
    <button value="${id}-move-${_dir}" class="regex-pair__btn regex-pair__btn--move" @click=${_getClick('move_' + _dir)} title="Move regex pair ${_dir} to position ${_newPos}">
      Move ${pos} ${_dir}
    </button>`
}

/**
 *
 * @param {string}  id    ID of the regex pair being rendered
 * @param {number}  pos   Position of regex pair in list of regex pairs
 * @param {number}  count Total number of regex pairs in the list
 * @param {boolean} up    Button is "Move up" or "Move down"
 *
 * @returns {lit-html}
 */
const addPair = (id, pos, _dir, _getClick) => {
  if (_dir !== 'before' && _dir !== 'after') {
    throw Error('addPair() expects third param _dir to be either "before" or "after"')
  }

  return html`
  <button value="${id}-add-${_dir}" class="regex-pair__btn regex-pair__btn--add" @click=${_getClick('add_' + _dir)} title="Add regex pair ${_dir} ${pos}">
    Add pair ${_dir} ${pos}
  </button>`
}
//  END:  sub views
// ============================================
// START: main view

/**
 * Render a oneOff regex-pair componenet.
 *
 * @param {object} props {
 *   pos: {number}        // position of pair in list of pairs
 *   count: {number}      // total number of pairs
 *   id: {string}         // MD5 hash of timestamp when pair
 *                        // was created
 *   regex: {
 *     pattern: {string}  // regular expression
 *     error: {string}    // error message
 *   }
 *   replace: {string}
 *   flags: {
 *     flags: {string}
 *     error: {string}    // error message
 *   }
 *   delimiters {null,object}: {
 *     open: {string}
 *     close: {string}
 *     error: {string}    // error message
 *   },
 *   hasError: {boolean}  // whether or not there are any errors
 *                        // for this regex pair
 *   multiLine: {boolean} // whether or to use text area for
 *                        // regex and replace
 *   transformEscaped: {boolean} // whether or not to transform
 *                        // escaped characters in replace pattern
 *                        // when doing find replace
 * }
 * @param {function} dispatch Redux store despatch function
 *
 * @returns {lit-html}
 */
export const regexPair = (props, dispatch) => {
  const _pos = hiddenPos(props.pos)

  // ============================================
  // START: event handlers

  // --------------------------------------------
  // START: event handler getters

  const getDelimChange = getAutoDispatchUpdateDelims(dispatch)
  const moveToClick = getAutoDispatchPairMoveTo(dispatch)
  const getBtnClick = getAutoDispatchPairBtn(dispatch)

  //  END:  event handler getters
  // --------------------------------------------
  // START: actual event handler functions

  const patternChange = getAutoDispatchUpdateRegex(dispatch)
  const replaceChange = getAutoDispatchUpdateReplace(dispatch)

  //  END: actual event handler functions
  // --------------------------------------------

  //  END:  event handlers
  // ============================================

  return html`
    <article id="${props.id}" class="regex-pair">
      <header class="regex-pair__header"><h3>Regex pair ${props.pos} (#${props.id})</h3></header>
      <main class="regex-pair__header">
        <ul>
          <li class="regex-pair__pattern">
            ${(props.regex.error !== '') ? html`<p class="regex-pair__pattern-error" id="${props.id}-pattern-error">props.regex.error</p>` : ''}
            <label for="${props.id}-regex" class="regex-pair__label">Regex</label>
            ${(props.multiLine)
              ? html`<textarea id="${props.id}-regex" aria-describedby="${props.id}-pattern-error" class="regex-pair__txt" @change=${patternChange} placeholder="regular expression">${props.regex.pattern}</textarea>`
              : html`<input id="${props.id}-regex" aria-describedby="${props.id}-pattern-error" class="regex-pair__input" value="${props.regex.pattern}" @change=${patternChange} placeholder="regular expression" />`}
          </li>
          <li class="regex-pair__flags">
            ${(props.flags.error !== '') ? html`<p class="regex-pair__flags-error" id="${props.id}-flags-error">props.flags.error</p>` : ''}
            <label for="${props.id}-flags" class="regex-pair__label">Flags</label>
            <input id="${props.id}-flags" aria-describedby="${props.id}-flags-error" class="regex-pair__input" value="${props.flags.flags}" @keyup=${getAutoDispatchUpdateFlags(dispatch)} placeholder="i" />
          </li>
          <li class="regex-pair__replace">
            <label for="${props.id}-replace" class="regex-pair__label">Replace</label>
            ${(props.multiLine)
              ? html`<textarea id="${props.id}-replace" aria-describedby="${props.id}-replace" class="regex-pair__txt" placeholder="replace" @keyup=${replaceChange}>${props.replace}</textarea>`
              : html`<input id="${props.id}-replace" class="regex-pair__input" value="${props.replace}" placeholder="replace" @keyup=${replaceChange} />`}
          </li>
          ${(props.delimiters !== null)
            ? html`
          <li class="regex-pair__delims">
            ${(props.flags.error !== '') ? html`<p class="regex-pair__delims-error" id="${props.id}-delims-error">props.delims.error</p>` : ''}

            <label for="${props.id}-delims-open" class="regex-pair__label">Opening delimiter</label>
            <input id="${props.id}-delims-open" aria-describedby="${props.id}-delims-error" maxchars="1" class="regex-pair__input" value="${props.delims.open}" @keyup=${getDelimChange(true)} />

            <label for="${props.id}-delims-close" class="regex-pair__label">Closing delimiter</label>
            <input id="${props.id}-delims-close" aria-describedby="${props.id}-delims-error" maxchars="1" class="regex-pair__input" value="${props.delims.close}" @keyup=${getDelimChange(false)} />
          </li>`
            : ''}
        </ul>
      </main>
      <footer class="regex-pair__footer">
        <ul class="regex-pair__control">
            <li>
              <label>
                <input type="checkbox" value="${props.id}-multiLine" ?checked=${props.multiLine} @change=${getAutoDispatchUpdateMultiLine(dispatch)} class="regex-pair--cb" />
                Multi-line input
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" value="${props.id}-whiteSpace" ?checked=${props.tranformEscaped} @change=${getAutoDispatchUpdateEscaped(dispatch)} class="regex-pair--cb" />
                Transform escaped characters in replacement
              </label>
            </li>
        </ul>
        <ul class="regex-pair__sibling-ctrl">
          <li class="regex-pair__sibling-ctrl__before">
            ${movePair(props.id, props.count, props.pos, 'up', getBtnClick)}<!--
            -->${addPair(props.id, props.count, 'before', getBtnClick)}
          </li>
          <li class="regex-pair__sibling-ctrl__this">
            ${deleteBtn(props.id, props.count, props.pos, getBtnClick)}<!--
            --><button value="${props.id}-reset" class="regex-pair__btn regex-pair__btn--reset" @click=${getBtnClick('reset')} title="Reset this regex pair">
              Reset ${_pos}
            </button><!--
            -->${disableBtn(props.id, props.count, props.isDisabled, props.pos, getBtnClick)}<!--
            --><button value="${props.id}-makeDefalt" class="regex-pair__btn regex-pair__btn--set-default" @click=${getBtnClick('set_as_default')} title="Use this regex pair's confguration as default for new regex pairs">
              Make default
            </button><!--
            -->${moveTo(props.id, props.count, props.pos, moveToClick)}
          </li>
          <li class="regex-pair__sibling-ctrl__after">
            ${movePair(props.id, props.count, props.pos, 'down', getBtnClick)}<!--
            -->${addPair(props.id, props.count, 'after', getBtnClick)}
          </li>
        </ul>
      </footer>
    </article>
  `
}
