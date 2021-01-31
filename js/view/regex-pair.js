import { html } from 'lit-html'
import { getID } from '../state/utils.js'
import { store } from '../state/index.js'
import {
  getAutoDispatchUpdateRegex,
  getAutoDispatchUpdateReplace,
  getAutoDispatchUpdateFlags,
  getAutoDispatchUpdateDelims,
  getAutoDispatchUpdateMultiLine,
  getAutoDispatchUpdateEscaped,
  getAutoDispatchMovePair,
  getAutoDispatchPairMoveTo,
  getAutoDispatchAddPair,
  getAutoDispatchResetRegexPair,
  getAutoDispatchDeleteRegexPair
} from '../state/single.state.actions'

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
// ============================================
// START: event handlers

// --------------------------------------------
// START: event handler getters

const getDelimChange = getAutoDispatchUpdateDelims(store)
const moveToClick = getAutoDispatchPairMoveTo(store)

const getMoveClick = getAutoDispatchMovePair(store)
const getAddClick = getAutoDispatchAddPair(store)

//  END:  event handler getters
// --------------------------------------------
// START: actual event handler functions

const patternChange = getAutoDispatchUpdateRegex(store)
const replaceChange = getAutoDispatchUpdateReplace(store)
const flagsChange = getAutoDispatchUpdateFlags(store)
const delimOpenChange = getDelimChange(true)
const delimCloseChange = getDelimChange(false)
const multiLineChange = getAutoDispatchUpdateMultiLine(store)
const transformEscapedChange = getAutoDispatchUpdateEscaped(store)
const resetClick = getAutoDispatchResetRegexPair(store)
const deleteClick = getAutoDispatchDeleteRegexPair(store)
const moveUpClick = getMoveClick(true)
const moveDownClick = getMoveClick(false)
const addBeforeClick = getAddClick(true)
const addAfterClick = getAddClick(false)

//  END: actual event handler functions
// --------------------------------------------

//  END:  event handlers
// ============================================
// START: sub views

const hiddenPos = (pos) => html`<span class="sr-only">number ${pos}</span>`

const moveTo = (id, count, pos) => {
  if (count < 2) {
    return ''
  }
  const _id = 'move-to-' + id
  const options = []
  for (let a = 1; a < count; a += 1) {
    options.push((a !== pos) ? html`<option value="${a}">${a}</option>` : html`<option value="" title="current position"> -- </option>`)
  }

  return html`
    <li>
      <label for="#${_id}">Move ${hiddenPos(pos)} to</label>
      <select id="${_id}" data-id="${id}" @change=${moveToClick(id)}>
        ${options.map(option => option)}
      </select>
    </li>
  `
}

//  END:  sub views
// ============================================
// START: main view

/**
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
 */

export const regexPair = (props) => {
  const movePairUp = (props.pos > 1) ? html`<button value="${props.pos}" class="regex-pair__btn regex-pair__btn--move" @click=${moveUpClick} title="Move regex pair up to position ${(props.pos - 1)}">Move ${hiddenPos} up</button>` : ''

  const movePairDown = (props.pos < props.count) ? html`<button value="${props.pos}" class="regex-pair__btn regex-pair__btn--move" @click=${moveDownClick} title="Move regex pair down to position ${(props.pos + 1)}">Move ${hiddenPos} down</button>` : ''

  // const moveTo = (props.count > 1) ?

  return html`
    <article id="${props.id}" class="regex-pair">
      <header class="regex-pair__header"><h3>Regex pair ${props.pos} (#${props.id})</h3></header>
      <main class="regex-pair__header">
        <ul>
          <li class="regex-pair__pattern">
            ${(props.regex.error !== '') ? html`<p class="regex-pair__pattern-error" id="${props.id}-pattern-error">props.regex.error</p>` : ''}
            <label for="${props.id}-regex" class="regex-pair__label">Regex</label>
            ${(props.multiLine)
              ? html`<textarea id="${props.id}-regex" aria-describedby="${props.id}-pattern-error" class="regex-pair__txt" @keyup=${patternChange} placeholder="regular expression">${props.regex.pattern}</textarea>`
              : html`<input id="${props.id}-regex" aria-describedby="${props.id}-pattern-error" class="regex-pair__input" value="${props.regex.pattern}" @keyup=${patternChange} placeholder="regular expression" />`}
          </li>
          <li class="regex-pair__flags">
            ${(props.flags.error !== '') ? html`<p class="regex-pair__flags-error" id="${props.id}-flags-error">props.flags.error</p>` : ''}
            <label for="${props.id}-flags" class="regex-pair__label">Flags</label>
            <input id="${props.id}-flags" aria-describedby="${props.id}-flags-error" class="regex-pair__input" value="${props.flags.flags}" @keyup=${flagsChange} placeholder="i" />
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

            <label for="${props.id}-delims--open" class="regex-pair__label">Opening delimiter</label>
            <input id="${props.id}-delims--open" aria-describedby="${props.id}-delims-error" maxchars="1" class="regex-pair__input" value="${props.delims.open}" @keyup=${delimOpenChange} />

            <label for="${props.id}-delims--close" class="regex-pair__label">Closing delimiter</label>
            <input id="${props.id}-delims--close" aria-describedby="${props.id}-delims-error" maxchars="1" class="regex-pair__input" value="${props.delims.close}" @keyup=${delimCloseChange} />
          </li>`
            : ''}
        </ul>
      </main>
      <footer class="regex-pair__footer">
        <ul class="regex-pair__control">
            <li>
              <label>
                <input type="checkbox" value="${props.id}" ?checked=${props.multiLine} @change=${multiLineChange} class="regex-pair--cb" />
                Multi-line input
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" value="${props.id}" ?checked=${props.tranformEscaped} @change=${transformEscapedChange} class="regex-pair--cb" />
                Transform escaped characters in replacement
              </label>
            </li>
        </ul>
        <ul class="regex-pair__sibling-ctrl">
          <li class="regex-pair__sibling-ctrl__before">
            ${movePairUp}
            <button value="${props.id}" class="regex-pair__btn regex-pair__btn--add" @click=${addBeforeClick}>Add pair before</button>
          </li>
          ${(props.count > 1)
            ? html`
            <li class="regex-pair__sibling-ctrl__this">
              <button value="${props.id}" class="regex-pair__btn regex-pair__btn--delete" @click=${deleteClick} title="Delete this regex pair">
                Delete ${hiddenPos}
              </button>
              <button value="${props.id}" class="regex-pair__btn regex-pair__btn--delete" @click=${resetClick} title="Delete this regex pair">
                Reset ${hiddenPos}
              </button>
            </li>
            ${moveTo(props.id, props.count, props.pos)}`
            : ''
          }
          <li class="regex-pair__sibling-ctrl__after">
            ${movePairDown}
            <button value="${props.id}" class="regex-pair__btn regex-pair__btn--add" @click=${addAfterClick}>Add pair after</button>
          </li>
        </ul>
      </footer>
    </article>
  `
}
