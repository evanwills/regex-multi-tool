import { html } from '../lit-html/lit-html.mjs'
import { isNumeric, isNotEmptyStr, getTabI } from '../utility-functions.mjs'

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
export const openCloseBtn = (id, label, target, isOpen, eventHandler, tabIndex) => {
  const _which = label.toLocaleLowerCase()
  const _is = (isOpen) ? 'is' : 'not'
  return html`
  <!-- START: openCloseBtn() -->
    <button value="${id}-toggleSettings-${_which}" class="rnd-btn rnd-btn--settings rnd-btn--settings--${_which} rnd-btn--settings--${_which}-${_is}" @click=${eventHandler} title="${label} settings for ${target}" tabindex="${getTabI(tabIndex)}">
      ${label}
    </button>
  <!--  END:  openCloseBtn() -->
  `
}


export const checkboxBtn = (id, label, value, isChecked, eventHandler, tabIndex, badge) => {
  return html`
  <!-- START: checkboxBtn() -->
  <li>
    <input type="checkbox" id="${id}" value="${value}" class="cb-btn__input" ?checked=${(isChecked)} @change=${eventHandler} tabindex="${getTabI(tabIndex)}" />
    <label for="${id}" class="cb-btn__label cb-btn__label--badge${isNotEmptyStr(badge) ? ' cb-btn__label--' + badge : ''}">${label}</label>
  </li>
  <!--  END:  checkboxBtn() -->
  `
}
