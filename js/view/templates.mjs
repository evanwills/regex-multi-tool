import { html } from 'lit-html'
import { regexPair } from './oneOff-pair.mjs'

/**
 * Template for header block for Regex multi tool
 *
 * @param {boolean}  isFancy
 * @param {function} changeHandler
 *
 * @returns {html} lit-html template function
 */
export const header = (isFancy, changeHandler) => {
  const _isFancy = (typeof isFancy === 'boolean' && isFancy === true)
  console.log('inside header()')
  console.log('isFancy:', isFancy)
  console.log('_isFancy:', _isFancy)

  // NOTE: the empty HTML comments within the unordered list
  //       are there because the white space they omit causes
  //       issues with the layout if not removed.

  return html`
  <header class="regex-multi__header">
    <h1 class="header-1">Regex multi tool</h1>
    <!-- <h2 class="header1">${(_isFancy === true) ? 'Do regex stuff' : 'Regex tester'}</h2> -->

    <ul class="btn-list btn-list--small">
      <li><!--
        --><input type="radio" id="mode-simple" name="mode" value="simple" ?checked=${!_isFancy} @change=${changeHandler} /><!--
        --><label for="mode-simple" class="btn-list__btn radio-btn-label"><span class="sr-only">Regex </span>tester</label><!--
      --></li>
      <li><!--
        --><input type="radio" id="mode-fancy" name="mode" value="fancy" ?checked=${_isFancy} @change=${changeHandler} /><!--
        --><label for="mode-fancy" class="btn-list__btn radio-btn-label"><span class="sr-only">Do regex </span>stuff</label><!--
        --></li>
    </ul>
  </header>`
}

export const footer = (buttons) => {
  return html`
  <footer>
    <ul class="action-btns">
      ${buttons.map(button => html`
      <li class="btn-wrap btn-wrap--${button.name}">
        <button name=${button.name} id=${button.name} .value="${button.value}" @click=${button.click}>
          ${button.label}
        </button>
      </li>
      `)}
    </ul>
  </footer>
  `
}

export const regexTestUI = (props) => {
  console.log('props:', props)
  return html`<h1>Regex test</h1>
  ${regexPair(props)}`
}

export const doStuffUI = (props) => {
  return html`<h1>Do regex stuff</h1>`
}

export const mainApp = (props) => {
  console.log('mainApp()')
  console.log('props:', props)
  return html`
    ${header(!props.simple, props.change)}
    ${(props.simple) ? regexTestUI(props.tool) : doStuffUI(props.tool)}
    ${footer(props.buttons)}
  `
}
