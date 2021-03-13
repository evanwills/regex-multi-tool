import { html } from '../lit-html/lit-html.mjs'
import { isNumeric } from '../utility-functions.mjs'

/**
 * Get an Open/Close button
 *
 * @param {string}   id           ID of the regex pair
 * @param {string}   target       Which settings block does this button control
 * @param {string}   label        Label for the checkbox
 * @param {boolean}  isOpen       Whether or not settings block is open
 * @param {function} eventHandler Event handler function
 * @param {number}   tabIndex     Position of this field relative to all other focusable elements
 * @returns
 */
export const openCloseButton = (id, target, label, isOpen, eventHandler, tabIndex) => {
  const _index = isNumeric(tabIndex) ? tabIndex : 0
  const _which = label.toLocaleLowerCase()
  const _is = (isOpen) ? 'is' : 'not'
  return html`
    <button value="${id}-toggleSettings-${_which}" class="rnd-btn rnd-btn--settings rnd-btn--settings--${_which} rnd-btn--settings--${_which}-${_is}" @click=${eventHandler} title="${label} settings for ${target}" tabindex="${_index}">
      ${label}
    </button>`
}
