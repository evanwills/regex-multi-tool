import { html } from '../../lit-html/lit-html.mjs'
import { isNonEmptyStr, getTabI, boolTrue, makeAttributeSafe } from '../../utility-functions.mjs'

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
  const _isRadio = boolTrue(isRadio)
  const _id = (_isRadio)
    ? id + '-' + makeAttributeSafe(value.toString())
    : id

  return html`
  <!-- START: checkboxBtn() -->
  <li>
    <input type="${(_isRadio) ? 'radio' : 'checkbox'}" id="${_id}" name="${id}" value="${value}" class="cb-btn__input" ?checked=${(isChecked)} @change=${eventHandler} tabindex="${getTabI(tabIndex)}" />
    <label for="${_id}" class="cb-btn__label cb-btn__label--badge${isNonEmptyStr(badge) ? ' cb-btn__label--' + badge : ''}">${label}</label>
  </li>
  <!--  END:  checkboxBtn() -->
  `
}

/**
 * Get HTML for a single radio button field with label and
 * wrapping <LI>.
 *
 * @param {string}   id           ID of the radio group
 * @param {string}   label        Label for the radio button
 * @param {string}   value        Value for the radio button
 * @param {boolean}  isChecked    Whether or not the radio button
 *                                is checked
 * @param {function} eventHandler Event handler function
 * @param {number}   tabIndex     Value for input's tabindex attribute
 * @param {string}   badge        custom badge (modifier class suffix)
 *
 * @returns {html}
 */
export const singleRadioBtn = (id, label, value, isChecked, eventHandler, tabIndex, badge) => {
  const _id = id + '-' + makeAttributeSafe(value)
  return html`<li><!--
  --><input type="radio" name="${id}" id="${_id}" value="${value}" class="radio-grp__input" ?checked=${isChecked} @change=${eventHandler} tabindex="${tabIndex}" /><!--
  --><label for="${_id}" class="radio-grp__label">${label}</label><!--
--></li>`
}

/**
 * Get a complete HTML block for a group of radio buttons.
 *
 * @param {string}   id           ID of the radio group
 * @param {string}   label        Label for the radio group (or empty
 *                                string if no label)
 * @param {string}   value        Current value for the radio group
 * @param {array}    btns         List of radio button options
 * @param {function} eventHandler Event handler function
 * @param {number}   tabIndex     Value for input's tabindex attribute
 * @param {string}   badge        custom badge (modifier class suffix)
 *
 * @returns {html}
 */
export const radioBtnGroup = (id, label, value, btns, eventHandler, tabIndex, badge) => {
  console.log('value:', value)
  if (isNonEmptyStr(label)) {
    return html`
    <div class="radio-grp__wrapper" role="radiogroup" aria-labelledby="${id}-label">
      <h4 id="${id}-label" class="radio-grp__h">${label}</h4>
      <ul class="list-clean list-inline radio-grp">
        ${btns.map(btn => singleRadioBtn(
          id,
          btn.label,
          btn.value,
          (btn.value === value),
          eventHandler,
          tabIndex,
          badge
        ))}
      </ul>
    </div>
    `
  } else {
    return html`
      <ul class="list-clean list-inline radio-grp" role="radiogroup">
        ${btns.map(btn => singleRadioBtn(
          id,
          btn.label,
          btn.value,
          (btn.value === value),
          eventHandler,
          tabIndex,
          badge
        ))}
      </ul>
    `
  }
}
