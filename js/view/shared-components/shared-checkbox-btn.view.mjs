import { html } from '../../lit-html/lit-html.mjs'
import { isNonEmptyStr, getTabI, boolTrue } from '../../utility-functions.mjs'

/**
 * Get a whole checkbox input with label and wrapping li tag with
 * class names to make it look like a button
 *
 * @param {string}   id           ID of the field
 * @param {string}   label        Label text visible to the user
 * @param {string,number} value   Value that the app passes to Redux
 * @param {boolean}  isChecked    Whether or not the checkbox is
 *                                checked
 * @param {function} eventHandler Function that handles change events
 * @param {number}   tabIndex     Value for input's tabindex attribute
 * @param {string}   badge        custom badge (modifier class suffix)
 * @param {boolean}  isRadio
 *
 * @returns {html}
 */
export const checkboxBtn = (id, label, value, isChecked, eventHandler, tabIndex, badge, isRadio) => {
  return html`
  <!-- START: checkboxBtn() -->
  <li>
    <input type="${(boolTrue(isRadio)) ? 'radio' : 'checkbox'}" id="${id}" value="${value}" class="cb-btn__input" ?checked=${(isChecked)} @change=${eventHandler} tabindex="${getTabI(tabIndex)}" />
    <label for="${id}" class="cb-btn__label cb-btn__label--badge${isNonEmptyStr(badge) ? ' cb-btn__label--' + badge : ''}">${label}</label>
  </li>
  <!--  END:  checkboxBtn() -->
  `
}
