import { html } from '../lit-html/lit-html.mjs'
import { getID, getTabI } from '../utility-functions.mjs'
import { openCloseBtn, checkboxBtn } from './shared-components.mjs'

// ============================================
// START: non-view functions

export const getNewPair = (_defaults) => {
  let _delims = null
  let _flags = ''
  let _multi = false
  let _escape = true

  if (typeof _defaults !== 'undefined') {
    if (typeof _defaults.delims !== 'undefined' && isStr(_defaults.delims.open) && isStr(_defaults.delims.close)) {
      _delims = {
        open: _defaults.delims.open,
        close: _defaults.delims.close,
        errors: ''
      }
    }

    if (isStr(_defaults.flags)) {
      _flags = _defaults.flags
    }

    if (isBool(_defaults.multiLine)) {
      _multi = _defaults.multiLine
    }

    if (isBool(_defaults.transformEscaped)) {
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
 * @param {function} _change    Generic change event handler function
 *                              that uses the ID attribute of the
 *                              field to determine the type of action
 *                              required.
 *
 * @returns {lit-html} render function
 */
const moveTo = (id, count, pos, _change, tabIndex) => {
  const _id = id + '-moveTo'
  const options = []

  if (count < 2) {
    return ''
  }

  for (let a = 0; a < count; a += 1) {
    options.push({
      current: (a === (pos - 1)),
      value: a,
      pos: a + 1,
      dir: (a < pos) ? 'up' : 'down'
    })
  }

  return html`
    <span class="r-pair__move-to__wrap"><!--
      --><label for="${_id}" class="r-pair__move-to__label">Move ${hiddenPos(pos)} to</label><!--
      --><select id="${_id}" class="r-pair__move-to__field" data-id="${id}" @change=${_change} tabindex="${getTabI(tabIndex)}">
        ${options.map(option => (option.current)
          ? html`<option value="" title="current position (${option.pos})" selected="selected"></option>`
          : html`<option value="${option.value}" title="Move ${option.dir} to position ${option.pos}">${option.pos}</option>`
        )}
      </select><!--
    --></span>
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
 * @param {function} _click     Generic simple event handler function
 *                              that uses the value attribute of the
 *                              button to determine the type of action
 *                              required.
 *
 * @returns {lit-html} render function
 */
const disableBtn = (id, count, isDisabled, pos, _click, tabIndex) => {
  const _mode = (isDisabled) ? 'Enable' : 'Disable'

  return (count > 1)
    ? html`
      <button value="${id}-disable" class="rnd-btn rnd-btn--${_mode.toLocaleLowerCase()}" @click=${_click} title="${_mode} this regex pair" tabindex="${getTabI(tabIndex)}">
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
 * @param {string}   id     ID of the regex pair being rendered
 * @param {number}   count  Total number of regex pairs in the
 *                          list
 * @param {number}   pos    Position of regex pair in list of
 *                          regex pairs
 * @param {function} _click Generic simple event handler function
 *                          that uses the value attribute of the
 *                          button to determine the type of action
 *                          required.
 *
 * @returns {lit-html} render function
 */
const deleteBtn = (id, count, pos, _click, tabIndex) => {
  return (count > 1)
    ? html`
      <button value="${id}-delete" class="rnd-btn rnd-btn--danger rnd-btn--delete" @click=${_click} title="Delete this regex pair" tabindex="${getTabI(tabIndex)}">
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
 * @param {function} clickHandler A function that returns the
 *                             appropriate event handler for the
 *                             button (that automatically dispatches
 *                             an action to the redux store)
 *
 * @returns {lit-html} render function
 */
const movePair = (id, count, pos, _dir, clickHandler, tabIndex) => {
  let _newPos = -1

  if (typeof _dir !== 'string' || (_dir !== 'up' && _dir !== 'down')) {
    throw Error('movePair() expects fourth param _dir to be either "up" or "down"')
  }

  if (count === 1) {
    return ''
  }

  if (_dir === 'up') {
    if (pos === 1) {
      console.log('pos:', pos)
      return ''
    }
    _newPos = pos - 1
  } else {
    if (pos === count) {
      return ''
    }
    _newPos = pos + 1
  }

  return html`
    <button value="${id}-move-${_dir}" class="rnd-btn rnd-btn--move rnd-btn--move--${_dir}" @click=${clickHandler} title="Move regex pair ${_dir} to position ${_newPos}" tabindex="${getTabI(tabIndex)}">
      Move ${pos} ${_dir}
    </button>`
}

/**
 * Get a checkbox & label pair
 *
 * @param {string}   id           ID of the regex pair
 * @param {string}   label        Label for the checkbox
 * @param {string}   suffix       Suffix for the ID & class
 * @param {boolean}  isChecked    Whether or not the checkbox is checked
 * @param {function} eventHandler Event handler function
 * @returns
 */
const checkboxField = (id, label, classSuffix, isChecked, eventHandler, tabIndex) => {
  const _id = id + '-' + classSuffix

  return checkboxBtn(_id, label, _id, isChecked, eventHandler, tabIndex)
}

/**
 * Get an "Add pair button"
 *
 * @param {string}   id           ID of the regex pair being rendered
 * @param {number}   pos          Position of regex pair in list of regex pairs
 * @param {number}   _dir         Total number of regex pairs in the list
 * @param {function} clickHandler Button is "Move up" or "Move down"
 *
 * @returns {lit-html}
 */
const addPair = (id, pos, _dir, clickHandler, tabIndex) => {
  if (_dir !== 'before' && _dir !== 'after') {
    throw Error('addPair() expects third param _dir to be either "before" or "after"')
  }

  return html`<button value="${id}-add-${_dir}" class="rnd-btn rnd-btn--add" @click=${clickHandler} title="Add regex pair ${_dir} ${pos}" tabindex="${getTabI(tabIndex)}">
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
 *   settingsOpen: {boolean} // Whether or not the regex pair's
 *                        // settings block should be visible
 *   simpleEvent: {function} // handle events where the action can
 *                        // be determined purely from the contents
 *                        // of the emitter's value attribute
 *   valueEvent: {function} // handle events where the action can
 *                        // be determined from the contents of the
 *                        // emitter's ID attribute and the emitter's
 *                        // value attribute holds the new value the
 *                        // action needs to process
 * }
 * @param {function} dispatch Redux store despatch function
 *
 * @returns {lit-html}
 */
export const regexPair = (props) => {
  const _pos = hiddenPos(props.pos)

  const tabIndex = (props.settingsOpen) ? 0 : -1

  return html`
  <li>
    <article id="${props.id}" class="r-pair settings_wrap">
      <header class="r-pair__header"><h3 class="r-pair__h">Regex pair ${props.pos} (#${props.id})</h3></header>
      <main class="r-pair__main${(props.fullWidth) ? ' r-pair__main--full-width' : ''}">
        ${(props.regex.error !== '') ? html`<p class="r-pair__error r-pair__error--regex" id="${props.id}-pattern-error">props.regex.error</p>` : ''}
        <label for="${props.id}-regex" class="r-pair__label r-pair__label--regex">Regex</label>
        ${(props.multiLine)
          ? html`<textarea id="${props.id}-regex" aria-describedby="${props.id}-pattern-error" class="r-pair__txt r-pair__field r-pair__field--regex" @change=${props.events.pairValue} placeholder="regular expression">${props.regex.pattern}</textarea>`
          : html`<input id="${props.id}-regex" aria-describedby="${props.id}-pattern-error" class="r-pair__input r-pair__field r-pair__field--regex" value="${props.regex.pattern}" @change=${props.events.pairValue} placeholder="regular expression" />`}
        ${(props.flags.error !== '') ? html`<p class="r-pair__error r-pair__flags-error" id="${props.id}-flags-error">props.flags.error</p>` : ''}
        <label for="${props.id}-flags" class="r-pair__label r-pair__label--flags">Flags</label>
        <input id="${props.id}-flags" aria-describedby="${props.id}-flags-error" class="r-pair__input r-pair__field--flags" value="${props.flags.flags}" @keyup=${props.events.pairValue} placeholder="i" />
        <label for="${props.id}-replace" class="r-pair__label r-pair__label--replace">Replace</label>
        ${(props.multiLine)
          ? html`<textarea id="${props.id}-replace" aria-describedby="${props.id}-replace" class="r-pair__txt r-pair__field r-pair__field--replace" placeholder="replace" @change=${props.events.pairValue}>${props.replace}</textarea>`
          : html`<input id="${props.id}-replace" class="r-pair__input r-pair__field r-pair__field--replace" value="${props.replace}" placeholder="replace" @change=${props.events.pairValue}} />`}
        ${(props.delims.allow === true)
          ? html`
          ${(props.delims.error !== '') ? html`<p class="r-pair__error r-pair__delims-error" id="${props.id}-delims-error">props.delims.error</p>` : ''}

          <label for="${props.id}-delims-open" class="r-pair__label">Opening delimiter</label>
          <input id="${props.id}-delims-open" aria-describedby="${props.id}-delims-error" maxchars="1" class="r-pair__input r-pair__field--delims-open" value="${props.delims.open}" @keyup=${props.events.pairValue} />

          <label for="${props.id}-delims-close" class="r-pair__label">Closing delimiter</label>
          <input id="${props.id}-delims-close" aria-describedby="${props.id}-delims-error" maxchars="1" class="r-pair__input r-pair__field--delims-close" value="${props.delims.close}" @keyup=${props.events.pairValue} />
          `
          : ''}
      </main>

      ${openCloseBtn(props.id, 'Open', 'this Regex Pair', props.settingsOpen, props.events.simplePair)}

      <footer class="r-pair__footer settings settings--${(props.settingsOpen) ? 'opened' : 'closed'}">
        <ul class="r-pair__control clean-list">
            ${checkboxField(
              props.id,
              'Multi-line input',
              'multiLine',
              props.multiLine,
              props.events.simplePair,
              tabIndex
            )}
            ${checkboxField(
              props.id,
              'Full width input',
              'fullWidth',
              props.fullWidth,
              props.events.simplePair,
              tabIndex
            )}
            ${checkboxField(
              props.id,
              'Transform escaped characters in replacement',
              'whiteSpace',
              props.transformEscaped,
              props.events.simplePair,
              tabIndex
            )}
        </ul>

        <ul class="r-pair__sibling-ctrl clean-list">
          <li class="r-pair__sibling-ctrl__before">
            ${movePair(props.id, props.count, props.pos, 'up', props.events.simplePair,
                tabIndex)}<!--
            -->${addPair(props.id, props.count, 'before', props.events.simplePair,
                tabIndex)}
          </li>
          <li class="r-pair__sibling-ctrl__this">
            ${deleteBtn(props.id, props.count, props.pos, props.events.simplePair, tabIndex)}<!--
            --><button value="${props.id}-reset" class="rnd-btn rnd-btn--danger rnd-btn--reset" @click=${props.events.simplePair} title="Reset this regex pair" tabindex="${tabIndex}">Reset ${_pos}</button><!--
            -->${disableBtn(props.id, props.count, props.isDisabled, props.pos, props.events.simplePair, tabIndex)}<!--
            --><button value="${props.id}-setDefault" class="rnd-btn rnd-btn--set-default" @click=${props.events.simplePair} title="Use this regex pair's confguration as default for new regex pairs" tabindex="${tabIndex}">Make default</button><!--
            -->${moveTo(props.id, props.count, props.pos, props.events.pairValue, tabIndex)}
          </li>
          <li class="r-pair__sibling-ctrl__after">
            ${movePair(props.id, props.count, props.pos, 'down', props.events.simplePair, tabIndex)}<!--
            -->${addPair(props.id, props.count, 'after', props.events.simplePair, tabIndex)}
          </li>
        </ul>

        ${openCloseBtn(props.id, 'Close', 'this Regex Pair', props.settingsOpen, props.events.simplePair, tabIndex)}
      </footer>
    </article>
  </li>
  `
}

export const oneOffRegexView = (props, eventHandlers) => {
  return html`<section>
    <ul class="clean-list">
      ${props.pairs.map(pair => regexPair({...pair, events: eventHandlers}))}
    </ul>
  </section>`
}
