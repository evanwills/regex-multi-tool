import { html } from '../lit-html/lit-html.mjs'

// ============================================
// START: non-view functions

export const getID = () => {
  let basicID = Date.now()
  basicID = basicID.toString()
  return 'R' + basicID.substr(-9)
}

export const clonePair = (oldPair) => {
  return {
    ...oldPair,
    id: getID(),
    pos: 0,
    count: 0,
    regex: { pattern: '', error: '' },
    replace: ''
  }
}

export const resetPair = (oldPair) => {
  return {
    ...oldPair,
    regex: { pattern: '', error: '' },
    replace: ''
  }
}

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

function moveUpClick (e) {
  console.log('moveUpClick()')
  console.log('this:', this)
}

function moveDownClick (e) {
  console.log('moveDownClick()')
  console.log('this:', this)
}

function deleteClick (e) {
  console.log('moveDownClick()')
  console.log('this:', this)
}

function addBeforeClick (e) {
  console.log('addBeforeClick()')
  console.log('this:', this)
}

function addAfterClick (e) {
  console.log('addAfterClick()')
  console.log('this:', this)
}

function multiLineChange (e) {
  console.log('multiLineChange()')
  console.log('this:', this)
}

function transformEscapeChange (e) {
  console.log('transformEscapeChange()')
  console.log('this:', this)
}

function patternKeyUp (e) {
  console.log('patternKeyUp()')
  console.log('this:', this)
}

function delimOpenKeyUp (e) {
  console.log('delimOpenKeyUp()')
  console.log('this:', this)
}

function delimCloseKeyUp (e) {
  console.log('delimCloseKeyUp()')
  console.log('this:', this)
}

function flagsKeyUp (e) {
  console.log('flagsKeyUp()')
  console.log('this:', this)
}

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
  const hiddenPos = html`<span class="sr-only">number ${props.pos}</span>`
  const movePairUp = (props.pos > 1) ? html`<button value="${props.pos}" class="regex-pair__btn regex-pair__btn--move" @click=${moveUpClick} title="Move regex pair up to position ${(props.pos - 1)}">Move ${hiddenPos} up</button>` : ''

  const movePairDown = (props.pos < props.count) ? html`<button value="${props.pos}" class="regex-pair__btn regex-pair__btn--move" @click=${moveDownClick} title="Move regex pair down to position ${(props.pos + 1)}">Move ${hiddenPos} down</button>` : ''

  return html`
    <article id="${props.id}" class="regex-pair">
      <header class="regex-pair__header"><h3>Regex pair ${props.pos} (${props.id})</h3></header>
      <main class="regex-pair__header">
        <ul>
          <li class="regex-pair__pattern">
            ${(props.regex.error !== '') ? html`<p class="regex-pair__pattern-error" id="${props.id}-pattern-error">props.regex.error</p>` : ''}
            <label for="${props.id}-regex" class="regex-pair__label">Regex</label>
            ${(props.multiLine)
              ? html`<textarea id="${props.id}-regex" aria-describedby="${props.id}-pattern-error" class="regex-pair__txt" @keyup=${patternKeyUp} placeholder="regular expression">${props.regex.pattern}</textarea>`
              : html`<input id="${props.id}-regex" aria-describedby="${props.id}-pattern-error" class="regex-pair__input" value="${props.regex.pattern}" @keyup=${patternKeyUp} placeholder="regular expression" />`}
          </li>
          <li class="regex-pair__flags">
            ${(props.flags.error !== '') ? html`<p class="regex-pair__flags-error" id="${props.id}-flags-error">props.flags.error</p>` : ''}
            <label for="${props.id}-flags" class="regex-pair__label">Flags</label>
            <input id="${props.id}-flags" aria-describedby="${props.id}-flags-error" class="regex-pair__input" value="${props.flags.flags}" @keyup=${flagsKeyUp} placeholder="i" />
          </li>
          <li class="regex-pair__replace">
            <label for="${props.id}-replace" class="regex-pair__label">Replace</label>
            ${(props.multiLine)
              ? html`<textarea id="${props.id}-replace" aria-describedby="${props.id}-replace" class="regex-pair__txt" placeholder="replace">${props.replace}</textarea>`
              : html`<input id="${props.id}-replace" class="regex-pair__input" value="${props.replace}" placeholder="replace" />`}
          </li>
          ${(props.delimiters !== null)
            ? html`
          <li class="regex-pair__delims">
            ${(props.flags.error !== '') ? html`<p class="regex-pair__delims-error" id="${props.id}-delims-error">props.delims.error</p>` : ''}

            <label for="${props.id}-delims--open" class="regex-pair__label">Opening delimiter</label>
            <input id="${props.id}-delims--open" aria-describedby="${props.id}-delims-error" maxchars="1" class="regex-pair__input" value="${props.delims.open}" @keyup=${delimOpenKeyUp} />

            <label for="${props.id}-delims--close" class="regex-pair__label">Closing delimiter</label>
            <input id="${props.id}-delims--close" aria-describedby="${props.id}-delims-error" maxchars="1" class="regex-pair__input" value="${props.delims.close}" @keyup=${delimCloseKeyUp} />
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
                <input type="checkbox" value="${props.id}" ?checked=${props.tranformEscaped} @change=${transformEscapeChange} class="regex-pair--cb" />
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
            </li>`
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
