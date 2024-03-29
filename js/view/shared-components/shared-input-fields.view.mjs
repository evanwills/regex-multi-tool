import { html } from '../../lit-html/lit-html.mjs'
import { ifDefined } from '../../lit-html/directives/if-defined.mjs'
import {
  isBool,
  isBoolTrue,
  // isFunction,
  // isInt,
  isNonEmptyStr,
  isNumber,
  // isNumeric,
  isStr,
  isStrNum
} from '../../utilities/validation.mjs'
import {
  getClassName,
  idSafe,
  // makeHTMLsafe,
  ucFirst
} from '../../utilities/sanitise.mjs'

/**
 * Get the attribute string for an HTML input/select/textarea field
 *
 * @param {string} attr   Key in props object
 *                        (and HTML attribute name)
 * @param {object} props  Object to get attribute values from
 * @param {string} prefix Prefix for object property name to allow
 *                        for the component to have multiple elements
 *                        with different values for the same
 *                        attribute name
 *
 * @returns {string} HTML attribute with value or empty string
 */
export const getAttr = (attr, props, prefix) => {
  const _attr = (typeof prefix === 'string')
    ? prefix.trim() + ucFirst(attr.trim())
    : attr

  return (isNumber(props[_attr]) || isNonEmptyStr(props[_attr]))
    ? ' ' + attr.toLowerCase() + '="' + props[_attr] + '"'
    : ''
}

/**
 * Get multiple attribute strings for an HTML input/select/textarea
 * field
 *
 * @param {string} attr  Array of keys in props object
 *                       (and HTML attribute names)
 * @param {object} props Object to get attribute values from
 *
 * @returns {string} String of HTML attributes with value or empty
 *                   string if no attributes had values
 * @param {string} prefix Prefix for object property name to allow
 *                        for the component to have multiple elements
 *                        with different values for the same
 *                        attribute name
 */
export const getAttrs = (attrArr, props, prefix) => {
  let output = ''

  for (let a = 0; a < attrArr.length; a += 1) {
    output += getAttr(attrArr[a], props, prefix)
  }
  return output
}

/**
 * Get something to use as a value
 *
 * @param {object} props Object to get attribute values from
 *
 * @returns {string}
 */
const getValue = (props) => {
  return (isNonEmptyStr(props.value))
    ? props.value
    : (typeof props.default !== 'undefined')
      ? props.default
      : ''
}

/**
 * Get the bolean attribute string for an HTML input/select/textarea
 * field
 *
 * @param {string}  attr    Key in props object
 *                          (and HTML attribute name)
 * @param {object}  props   Object to get attribute values from
 * @param {boolean} reverse Reverse the value of the output
 *                          (TRUE returns FALSE)
 *
 * @returns {boolean} HTML attribute with value or empty string
 */
export const getBoolAttr = (attr, props, reverse) => {
  const output = isBoolTrue(props[attr])
  return (isBoolTrue(reverse)) ? !output : output
}

/**
 * Get an HTML Label element for an input/textarea/select field
 *
 * @param {object} props List of input field properties
 *
 * @returns {lit-html}
 */
export const getLabel = (props) => {
  return html`<label for="${props.id}" class="${getClassName(props, 'label')}">
    ${props.label}
  </label>`
}

/**
 * Get a single datalist option element
 *
 * @param {string,object} input Value of data option
 *                              If value is a string then it is
 *                              simply used as the value of the
 *                              option
 *                              If the value is an object with with
 *                              a value property, then the value
 *                              prop is used as the option value.
 *                              If the object also has a default
 *                              property, then the option is set to
 *                              selected.
 *
 * @returns {lit-html}
 */
export const dataOption = (input) => {
  const _type = typeof input.option
  if (_type === 'object') {
    const _selected = (isBoolTrue(input.default))
    return html`<option value="${input.value}" ?selected=${_selected}>`
  } else if (isStrNum(_type)) {
    return html`<option value="${input}">`
  } else {
    throw Error('dataOption() expects input to be either a string, a number or an object with a "value" property (and optionally a "default" property). ' + _type + ' given!')
  }
}

/**
 * Get a datalist element for predefined text field options
 *
 * @param {string} id      ID of the parent element
 * @param {array}  options List of data list options
 *
 * @returns {lit-html}
 */
export const dataList = (id, options) => {
  if (typeof options !== 'undefined' && Array.isArray(options) && options.length > 0) {
    return html`
      <datalist id="${id}-options">
        ${options.map(dataOption)}
      </datalist>
    `
  } else {
    return ''
  }
}

/**
 * Get a "list" attribute for text input
 *
 * @param {object} props Input field properties.
 *
 * @returns {string}
 */
export const getListAttr = (props) => {
  if (typeof props.options !== 'undefined' && Array.isArray(props.options) && props.options.length > 0) {
    return ' list="' + props.id + '-options"'
  } else {
    return ''
  }
}

/**
 * Get a "list" attribute for text input
 *
 * @param {object} props Input field properties.
 *
 * @returns {string}
 */
export const getDescbyAttr = (props) => {
  return (isNonEmptyStr(props.desc))
    ? props.id + '-describe'
    : undefined
}
/**
 * Get a description block for a input field.
 *
 * @param {object} props All the properties of the parent element
 *
 * @returns {lit-html}
 */
export const describedBy = (props) => {
  return (isNonEmptyStr(props.desc))
    ? html`<div id="${props.id}-describe" class=${getClassName(props, 'desc')}>${props.desc}</div>`
    : ''
}

// const getStandardAttrs = (props) => {
//   const allBoolAttrs = ['required', 'readonly', 'disabled']
//   const output = {}

//   for (let a = 0; a < allBoolAttrs.length; a += 1) {
//     if (isBoolTrue(props[allBoolAttrs[a]])) {
//       output[allBoolAttrs[a]] = props[allBoolAttrs[a]]
//     }
//   }

//   if (isInt(props.tabIndex)) {
//     output.tabindex = props.tabIndex
//   }

//   if (isFunction(props.change)) {
//     output.change = props.change
//   }

//   if (isFunction(props.click)) {
//     output.click = props.click
//   }

//   console.log('props:', props)
//   console.log('props.description:', props.description)
//   if (isNonEmptyStr(props.description)) {
//     output['aria-describedby'] = getDescbyAttr(props)
//   }

//   return output
// }

// const getOptionalAttrs = (props, isNumb) => {
//   const _isNum = isBoolTrue(isNumb)
//   const attrs = (_isNum)
//     ? ['min', 'max', 'step']
//     : ['minLength', 'maxLength', 'spellcheck']
//   const validator = (_isNum) ? isInt : isNonEmptyStr

//   const allStrAttrs = ['pattern', 'placeholder']

//   const output = {}
//   for (let a = 0; a < attrs.length; a += 1) {
//     if (validator(props[attrs[a]])) {
//       output[attrs[a]] = props[attrs[a]]
//     }
//   }

//   for (let a = 0; a < allStrAttrs.length; a += 1) {
//     if (isNonEmptyStr(props[allStrAttrs[a]])) {
//       output[allStrAttrs[a]] = props[allStrAttrs[a]]
//     }
//   }

//   // return output
//   return {
//     ...output,
//     ...getStandardAttrs(props)
//   }
// }

// /**
//  * Get a string to be used as an HTML attribute value
//  *
//  * @param {any} input Value to be returned (hopefully) String or
//  *                    number
//  * @param {string, undefined} defaultStr default string if input is
//  *                   not valid
//  *
//  * @returns {string} String to be used as an HTML attribute value
//  */
// const propOrEmpty = (input, defaultStr) => {
//   return (isStrNum(input))
//     ? input
//     : isStr(defaultStr)
//       ? defaultStr
//       : ''
// }

/**
 * Get a string to be used as an HTML attribute value
 *
 * @param {any} input Value to be returned (hopefully) String or
 *                    number
 * @param {string, undefined} defaultStr default string if input is
 *                   not valid
 *
 * @returns {string} String to be used as an HTML attribute value
 */
const propOrUn = (input, defaultStr) => {
  return (isStrNum(input))
    ? input
    : isStrNum(defaultStr)
      ? defaultStr
      : undefined
}

/**
 * Get an text input field (with label)
 *
 * @param {object}  props     All the properties required for an
 *                            input field
 * @param {boolean} multiLine Whether or not input needs to be
 *                            textarea
 *
 * @return {lit-html}
 */
export const textInputField = (props, multiLine) => {
  // const txtProps = getAttrs(
  //   ['pattern', 'placeholder', 'list', 'maxlength', 'minlength', 'size'],
  //   props
  // )

  const _listAttr = getListAttr(props)
  const _descBy = getDescbyAttr(props)

  const _place = propOrUn(props.placeholder, props.label)
  const _pattern = propOrUn(props.pattern)
  const _maxLen = propOrUn(props.maxlength)
  const _minLen = propOrUn(props.minlength)
  const _disabled = getBoolAttr('disabled', props)
  const _required = getBoolAttr('required', props)
  const _read = getBoolAttr('readonly', props)
  const _value = getValue(props)

  // console.group('textInputField()')
  // console.log('props:', props)
  // console.log('props.pattern:', props.pattern, (typeof props.pattern === 'undefined'))
  // console.log('props.placeholder:', props.placeholder, (typeof props.placeholder === 'undefined'))
  // console.log('props.maxLength:', props.maxLength, (typeof props.maxLength === 'undefined'))
  // console.log('props.minLength:', props.minLength, (typeof props.minLength === 'undefined'))
  // console.log('props.value:', props.value)
  // console.log('props.change:', props.change)
  // console.log('_descBy:', _descBy, (typeof _descBy === 'undefined'))
  // console.log('multiLine:', multiLine)
  // console.groupEnd()

  return (isBoolTrue(multiLine))
    ? html`
      ${getLabel(props)}
      <textarea id="${props.id}" class="${getClassName(props, 'input', 'multi-line')}" @change=${props.change} ?required=${_required} ?readonly=${_read} ?disabled=${_disabled} pattern="${ifDefined(_pattern)}" placeholder="${ifDefined(_place)}" maxlength="${ifDefined(_maxLen)}" minlength="${ifDefined(_minLen)}" aria-describedby="${ifDefined(_descBy)}" .value="${_value}"></textarea>
      ${(_descBy !== '') ? describedBy(props) : ''}
    `
    : html`
      ${getLabel(props)}
      <input type="text" id="${props.id}" .value=${_value} class="${getClassName(props, 'input')}" @change=${props.change} ?required=${getBoolAttr('required', props)} ?readonly=${_read} ?disabled=${_disabled} pattern="${ifDefined(_pattern)}" placeholder="${ifDefined(_place)}" maxlength="${ifDefined(_maxLen)}" minlength="${ifDefined(_minLen)}" aria-describedby="${ifDefined(_descBy)}" />
      ${(_listAttr !== '') ? dataList(props.id, props.options) : ''}
      ${(_descBy !== '') ? describedBy(props) : ''}
    `
}

/**
 * Get an number input field (with label)
 *
 * @param {object}  props     All the properties required for an
 *                            input field
 *
 * @return {lit-html}
 */
export const numberInputField = (props) => {
  const _descBy = getDescbyAttr(props)

  // console.group('numberInputField()')
  // console.log('props:', props)
  // console.groupEnd()

  return html`
    ${getLabel(props)}
    <input type="number" id="${props.id}" .value=${getValue(props)} class="${getClassName(props, 'input', 'number')}" @change=${props.change} ?required=${getBoolAttr('required', props)} ?readonly=${getBoolAttr('readonly', props)} ?disabled=${getBoolAttr('disabled', props)} pattern="${ifDefined(propOrUn(props.pattern))}" placeholder="${ifDefined(propOrUn(props.placeholder))}" min="${ifDefined(propOrUn(props.min))}" max="${ifDefined(propOrUn(props.max))}" step="${ifDefined(propOrUn(props.step))}" aria-describedby="${ifDefined(_descBy)}" />
    ${(_descBy !== '') ? describedBy(props) : ''}
  `
}

export const colourInput = (props) => {
  const _descBy = getDescbyAttr(props)

  return html`
    <li class="input-pair">
      <label for="set-customMode-${props.id}" class="input-pair__label">Custom mode ${props.label} colour:</label>
      <input type="color" id="set-customMode-${props.id}" class="input-pair__input" value="${getValue(props)}" tabindex="${props.tabIndex}" @change=${props.change} ?required=${getBoolAttr('required', props)} ?readonly=${getBoolAttr('readonly', props)} ?disabled=${getBoolAttr('disabled', props)} aria-describedby="${ifDefined(_descBy)}" /><!--
      --><span class="input-pair__suffix" style="background-color: ${getValue(props)};">&nbsp;</span>
      ${(_descBy !== '') ? describedBy(props) : ''}
    </li>
  `
}

/**
 * Get a single SELECT field option
 *
 * @param {string,object} props Value of select option
 *                              If value is a string then it is
 *                              simply used as the value and the
 *                              label of the option
 *                              If the value is an object with with
 *                              a value property, then the value
 *                              prop is used as the option value.
 *                              If the object also has a default
 *                              property, then the option is set to
 *                              selected.
 *
 * @return {lit-html}
 */
const selectOption = (props) => {
  // console.group('selectOption()')
  // console.log('props:', props)

  const _selected = isBool(props.selected)
    ? props.selected
    : isBoolTrue(props.default)

  const _value = (isStr(props))
    ? props
    : props.value

  let _label = (isStrNum(props))
    ? props
    : (isNonEmptyStr(props.label))
        ? props.label
        : props.value

  _label = isStr(_label) ? _label.trim() : _label

  // console.log('_value:', _value)
  // console.log('_label:', _label)
  // console.log('_selected:', _selected)
  // console.groupEnd()

  return html`<option value=${_value} ?selected=${_selected}>${_label}</option>`
}

/**
 * Get a whole SELECT field with label (and optional described by block)
 *
 * @param {object} props All the properties required for an input
 *                       field
 *
 * @return {lit-html}
 */
export const selectField = (props) => {
  const _descBy = getDescbyAttr(props)

  // console.log('props:', props)
  return html`
    ${getLabel(props)}
    <select id=${props.id} class="${getClassName(props, 'select')}" ?required=${getBoolAttr('required', props)} ?readonly=${getBoolAttr('readonly', props)} ?disabled=${getBoolAttr('disabled', props)} @change=${props.change} aria-describedby="${ifDefined(_descBy)}" />
      ${props.options.map(selectOption)}
    </select>
    ${(_descBy !== '') ? describedBy(props) : ''}
  `
}

/**
 * Get a single radio or checkbox input field
 *
 * @param {object} props     All the properties required for an
 *                           input field
 * @param {string} fieldType Whether the field is a "radio" or a
 *                           "checkbox" field
 * @param {string} descBy    Whole aria-describedby attribute string
 */
const checkableInput = (props, fieldType, descBy) => {
  const _name = (fieldType === 'radio') ? ' name="' + props.id + '"' : ''
  const _id = (fieldType === 'checkbox')
    ? props.id + '-' + idSafe(props.value)
    : props.id

  return html`
    <input type=${fieldType}
          id=${_id}
          ${_name}
          value=${props.value}
          class=${getClassName(props, 'checkable')}
          ?checked=${props.checked}
          ?required=${getBoolAttr('required', props)}
          ?readonly=${getBoolAttr('readonly', props)}
          ?disabled=${getBoolAttr('disabled', props)}
          aria-describedby="${ifDefined(descBy)}"
          @change=${props.change} />`
}

/**
 * Get a whole (labeled) checkbox/radio intut field
 *
 * @param {object} props    All the properties required for an
 *                          input field
 * @param {boolean} outside Whether or not the label should wrap
 *                          the input field or be a separate element
 *                          following the input field
 *
 * @return {lit-html}
 */
export const wholeSingleCheckable = (props, outside) => {
  const _fieldType = (typeof props.type === 'string' && props.type === 'checkbox') ? 'checkbox' : 'radio'
  const _descBy = getDescbyAttr(props)
  const _desription = (_descBy !== '') ? describedBy(props) : ''
  const _inputField = checkableInput(props, _fieldType, _descBy)

  if (typeof outside === 'boolean' && outside === true) {
    return html`
      ${_inputField}
      ${getLabel(props)}
      ${_desription}
    `
  } else {
    return html`
      <label class="${getClassName(props, 'label')}">
        ${_inputField}
        ${props.label}
      </label>
      ${_desription}
    `
  }
}

export const checkableInputGroup = (props, outside) => {
  const _fieldType = (typeof props.type === 'string' && props.type === 'checkbox') ? 'checkbox' : 'radio'

  const _role = (_fieldType === 'radio') ? 'radiogroup' : 'group'
  const _outside = (typeof props.wrapped === 'boolean' && props.wrapped === true)

  return html`
    <div role="${_role}" aria-labelledby="${props.id}-grp-lbl" class=${getClassName(props, 'grp')}>
      <p class=${getClassName(props, 'grp-lbl')} id="${props.id}-grp-lbl">
        ${props.label}
      </p>
      <ul class=${getClassName(props, 'grp-list')}>
        ${props.options.map((option) => wholeSingleCheckable(
          {
            ...option,
            type: _fieldType,
            id: option.id + '-input',
            class: props.class,
            change: (typeof option.change === 'function')
              ? option.change
              : (typeof props.change === 'function')
                ? props.change
                : null
          },
          _outside
        ))}
      </ul>
    </div>
  `
}
