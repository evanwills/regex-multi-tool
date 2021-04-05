import { html } from '../../lit-html/lit-html.mjs'
import {
  // isBool,
  isBoolTrue,
  isNonEmptyStr
} from '../../utilities/validation.mjs'
import {
  getTabI,
  makeAttributeSafe
} from '../../utilities/sanitise.mjs'

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
 * @param {boolean}  isRadio      Whether or not the output field
 *                                should be a radio input or checkbox
 *
 * @returns {html}
 */
export const checkboxBtn = (id, label, value, isChecked, eventHandler, tabIndex, badge, isRadio) => {
  const _isRadio = isBoolTrue(isRadio)
  const _id = id + '-' + makeAttributeSafe(value.toString())
  const _name = (_isRadio) ? id : _id
  const _type = (_isRadio) ? 'radio' : 'checkbox'

  return html`
  <!-- START: checkboxBtn() -->
  <li>
    <input type="${_type}" id="${_id}" name="${_name}" value="${value}" class="cb-btn__input" ?checked=${(isChecked)} @change=${eventHandler} tabindex="${getTabI(tabIndex)}" />
    <label for="${_id}" class="cb-btn__label cb-btn__label--badge${isNonEmptyStr(badge) ? ' cb-btn__label--' + badge : ''}">${label}</label>
  </li>
  <!--  END:  checkboxBtn() -->
  `
}

// const getFieldDesc = (id, description) => html`<div id="${id}-desc" class="field-description">${description}</div>`

const cbIsChecked = (value, allValues) => (allValues[value])
const radioIsChecked = (value, allValues) => (value == allValues) // eslint-disable-line

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
 * @param {boolean}  isRadio      Whether or not the output field
 *                                should be a radio input or checkbox
 *
 * @returns {html}
 */
export const checkboxBtnGroup = (id, label, value, btns, eventHandler, tabIndex, badge, isRadio, description) => {
  const _isRadio = isBoolTrue(isRadio)
  // let _describe = ''
  let _describedBy = ''

  if (isNonEmptyStr(description)) {
    _describedBy = id + '-desc'
    // _describe = getFieldDesc(id, description)
  }
  console.log('value:', value)

  const isChecked = (_isRadio) ? radioIsChecked : cbIsChecked

  if (isNonEmptyStr(label)) {
    return html`
    <div class="checkable-grp__wrap checkbox-grp__wrapper" role="group" aria-labelledby="${id}-label" ?aria-describedby="${_describedBy}">
      <h4 id="${id}-label" class="checkable-grp__h checkbox-grp__h">${label}</h4>
      <ul class="list-clean checkable-grp__items checkbox-grp__items">
        ${btns.map(btn => checkboxBtn(
          id,
          btn.label,
          btn.value,
          isChecked(btn.value, value),
          eventHandler,
          tabIndex,
          badge,
          _isRadio
        ))}
      </ul>
      ${_describedBy}
    </div>
    `
  } else {
    return html`
      <ul class="list-clean list-inline checkable-grp__wrap checkbox-grp__items" role="group" ?aria-describedby="${_describedBy}">
        ${btns.map(btn => checkboxBtn(
          id,
          btn.label,
          btn.value,
          isChecked(btn.value, value),
          eventHandler,
          tabIndex,
          badge,
          _isRadio
        ))}
      </ul>
      ${_describedBy}
    `
  }
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
export const radioBtnGroup = (id, label, value, btns, eventHandler, tabIndex, badge, description) => {
  // let _describe = ''
  let _describedBy = ''

  if (isNonEmptyStr(description)) {
    _describedBy = id + '-desc'
    // _describe = getFieldDesc(id, description)
  }

  if (isNonEmptyStr(label)) {
    return html`
    <div class="checkable-grp__wrap radio-grp__wrapper" role="radiogroup" aria-labelledby="${id}-label" ?aria-describedby="${_describedBy}">
      <h4 id="${id}-label" class="checkable-grp__h radio-grp__h">${label}</h4>
      <ul class="list-clean list-clean--tight list-inline radio-grp__items">
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
      ${_describedBy}
    </div>
    `
  } else {
    return html`
      <ul class="list-clean list-inline checkable-grp__wrap radio-grp__items" role="radiogroup" ?aria-describedby="${_describedBy}">
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
      ${_describedBy}
    `
  }
}
