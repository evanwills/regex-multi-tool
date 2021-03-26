import { html } from '../../lit-html/lit-html.mjs'
import { isStr, isInt } from '../../utility-functions.mjs'
import { radioBtnGroup, checkboxBtnGroup } from '../shared-components/shared-checkbox-btn.view.mjs'
import { textInputField, numberInputField } from '../shared-components/shared-input-fields.view.mjs'


const maxLabelLen = (last, current) => {
  if (isStr(current.label)) {
    return (current.label.length > last) ? current.label.length : last
  }
  return (current.value.length > last) ? current.value.length : last
}

const makeProps = (action, extraInput) => {

}

const wrapField = (field) => html`<div class="repeatable-extraInput__wrap">${field}</div>`

export const singleExtraInputView = (props, eventHandlers, tabIndex) => {
  let _tabIndex = (isInt(tabIndex)) ? tabIndex : 0

  console.log('props:', props)
  switch (props.type) {
    case 'textarea':
      return wrapField(textInputField(props, true))
      break

    case 'number':
      return wrapField(numberInputField(props))
      break

    case 'radio':
      const maxLen = props.options.reduce(maxLabelLen, 0)
      return (maxLen > 32)
        ? checkboxBtnGroup(props.id, props.label, props.value, props.options, eventHandlers.valueEvent, _tabIndex, '', true)
        : radioBtnGroup(props.id, props.label, props.value, props.options, eventHandlers.valueEvent, _tabIndex)
      break

    case 'checkbox':
      return checkboxBtnGroup(props.id, props.label, props.value, props.options, eventHandlers.simpleEvent, _tabIndex, '', true)
      break

    case 'select':
      return wrapField(selectField(props))
      break

    case 'text':
    default:
      return wrapField(textInputField(props, false))
      break
  }
}

export const allExtraInputsView = (fieldMeta, fieldValues, eventHandlers) => {
  if (Array.isArray(fieldMeta.extraInputs)) {
  return fieldMeta.extraInputs.map(field => html`
    <li class="repeatable-field">
      ${singleExtraInputView({ ...field, value: fieldValues[field.id] }, eventHandlers)}
    </li>`)
  } else {
    return ''
  }
}
