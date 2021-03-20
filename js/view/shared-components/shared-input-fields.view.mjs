import { html } from '../../lit-html/lit-html.mjs'
import { ucFirst, idSafe } from '../../utility-functions.mjs'

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

  return (typeof props[_attr] === 'number' || (typeof props[_attr] === 'string' && props[_attr].trim() !== ''))
    ? ' ' + attr.toLowerCase() + '="' + props[_attr] + '"'
    : ''
}

/**
 * Get string to use as class name for HTML element
 *
 * @param {object} props       properties for the element
 * @param {string} BEMelement  BEM *element* class name suffix
 * @param {string} BEMmodifier BEM *modifier* class name suffix
 * @param {string} prefix      Prefix for object property name to
 *                             allow for the component to have
 *                             multiple elements with different
 *                             values for the same attribute name
 *
 * @returns {string} HTML element class name
 */
export const getClassName = (props, BEMelement, BEMmodifier, prefix) => {
  const _cls = (typeof prefix === 'string' && prefix.trim() !== '')
    ? prefix.trim() + 'Class'
    : 'class'
  const _suffix = (typeof BEMelement === 'string' && BEMelement.trim() !== '')
    ? '__' + BEMelement.trim()
    : ''
  const _modifier = (typeof BEMmodifier === 'string' && BEMmodifier.trim() !== '')
    ? '--' + BEMmodifier.trim()
    : ''
  let _output = (typeof props[_cls] === 'string') ? props[_cls].trim() : ''
  _output = (_output === '' && typeof props.class === 'string') ? props.class.trim() : ''

  return (_output !== '') ? _output + _suffix + _modifier : ''
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
  const output = (typeof props[attr] === 'boolean' && props[attr] === true)
  return (typeof reverse === 'boolean' && reverse === true) ? !output : output
}

/**
 * Get an HTML Label element for an input/textarea/select field
 *
 * @param {object} props List of input field properties
 *
 * @returns {lit-html}
 */
export const label = (props) => {
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
    const _selected = (typeof input.default === 'boolean' && input.default === true)
    return html`<option value="${input.value}" ?selected=${_selected}>`
  } else if (_type === 'string' || _type === 'number') {
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
  if (typeof props.desc !== 'undefined' && props.desc.trim() !== '') {
    return ' aria-describedby="' + props.id + '-describe"'
  } else {
    return ''
  }
}
/**
 * Get a description block for a input field.
 *
 * @param {object} props All the properties of the parent element
 *
 * @returns {lit-html}
 */
export const describedBy = (props) => {
  return (typeof props.desc === 'string' && props.desc.trim() !== '')
    ? html`<div id="${props.id}-describe" class=${getClassName(props, 'desc')}>${props.desc}</div>`
    : ''
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
export const textInput = (props, multiLine) => {
  const txtProps = getAttrs(
    ['pattern', 'placeholder', 'list', 'maxlength', 'minlength', 'size'],
    props
  )
  const _listAttr = getListAttr(props)
  const _descBy = getDescbyAttr(props)

  if (typeof multiLine === 'boolean' && multiLine === true) {
    return html`
      ${label(props)}
      <textarea id="${props.id}"${txtProps} class="${getClassName(props, 'input')}" ?required=${getBoolAttr('required', props)} ?readonly=${getBoolAttr('readonly', props)} ?disabled=${getBoolAttr('disabled', props)} ?spellcheck=${getBoolAttr('spellcheck', props)} ?autocomplete=${getBoolAttr('autocomplete', props)}${_descBy} @change=${props.change}>${props.value}</textarea>
      ${(_descBy !== '') ? describedBy(props) : ''}
    `
  } else {
    return html`
      ${label(props)}
      <input type="text" id="${props.id}"${txtProps} .value=${props.value} class="${getClassName(props, 'input')}" ?required=${getBoolAttr('required', props)} ?readonly=${getBoolAttr('readonly', props)} ?disabled=${getBoolAttr('disabled', props)} ?spellcheck=${getBoolAttr('spellcheck', props)} ?autocomplete=${getBoolAttr('autocomplete', props)}${_listAttr}${_descBy} @change=${props.change} />${(_listAttr !== '') ? dataList(props.id, props.options) : ''}
      ${(_descBy !== '') ? describedBy(props) : ''}
    `
  }
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
  const _value = (typeof props === 'string')
    ? props
    : props.value
  const _label = (typeof props === 'string')
    ? props
    : (typeof props.label === 'string' && props.label.trim() !== '')
        ? props.label
        : props.value
  const _selected = (typeof props.selected === 'boolean' && props.selected === true)

  return html`<option value=${_value} ?selected=${_selected}>${_label.trim()}</option>`
}

/**
 * Get a whole SELECT field with label (and optional described by block)
 *
 * @param {object} props All the properties required for an input
 *                       field
 *
 * @return {lit-html}
 */
export const select = (props) => {
  const _descBy = getDescbyAttr(props)

  return html`
    ${label(props)}
    <select id=${props.id} class="${getClassName(props, 'select')}" ?required=${getBoolAttr('required', props)} ?readonly=${getBoolAttr('readonly', props)} ?disabled=${getBoolAttr('disabled', props)}${_descBy} @change=${props.change}>
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
          ${descBy}
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
      ${label(props)}
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

export const numberInput = (id, label, value, min, max, eventHandler) => {

}

export const colourInput = (id, label, value, eventHandler, tabIndex) => {
  return html`
    <li class="input-pair">
      <label for="set-customMode-${id}" class="input-pair__label">Custom mode ${label} colour:</label>
      <input type="color" id="set-customMode-${id}" class="input-pair__input" value="${value}" tabindex="${tabIndex}" @change=${eventHandler} /><!--
      --><span class="input-pair__suffix" style="background-color: ${value};">&nbsp;</span>
    </li>
  `
}
