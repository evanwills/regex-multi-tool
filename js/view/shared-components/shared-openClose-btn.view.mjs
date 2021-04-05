import { html } from '../../lit-html/lit-html.mjs'
import { getTabI } from '../../utilities/sanitise.mjs'
import { isStr } from '../../utilities/validation.mjs'

/**
 * Get an Open/Close button
 *
 * @param {string}   id           ID of the regex pair
 * @param {string}   label        Label for the checkbox
 * @param {string}   target       Which settings block does this button control
 * @param {boolean}  isOpen       Whether or not settings block is open
 * @param {function} eventHandler Event handler function
 * @param {number}   tabIndex     Position of this field relative to all other focusable elements
 * @returns
 */
export const openCloseBtn = (id, label, target, isOpen, eventHandler, tabIndex, size) => {
  const _which = label.toLocaleLowerCase()
  const _is = (isOpen) ? 'is' : 'not'
  let _size = ''
  const btnSizes = ['xs', 'sm', 'lg', 'xl']
  if (isStr(size) && btnSizes.indexOf(size) > -1) {
    _size = ' rnd-btn--' + size
  }

  return html`
  <!-- START: openCloseBtn() -->
    <button value="${id}-toggleSettings-${_which}" class="rnd-btn${_size} rnd-btn--settings rnd-btn--settings--${_which} rnd-btn--settings--${_which}-${_is}" @click=${eventHandler} title="${label} settings for ${target}" tabindex="${getTabI(tabIndex)}">
      ${label}
    </button>
  <!--  END:  openCloseBtn() -->
  `
}
