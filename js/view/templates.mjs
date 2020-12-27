import { html } from '../lit-html/lit-html.mjs'

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

  return html`
  <header>
    <h1 class="header1">Regex multi tool</h1>
    <h2 class="header1">${(_isFancy === true) ? 'Do regex stuff' : 'Regex tester'}</h2>

    <ul>
      <li>
        <input type="radio" id="mode-simple" name="mode" value="simple" ?checked=${!_isFancy} @onChange=${changeHandler} />
        <label for="mode-simple" class="radio-btn-label">Regex tester</label>
      </li>
      <li>
        <input type="radio" id="mode-fancy" name="mode" value="fancy" ?checked=${_isFancy} @onChange=${changeHandler} />
        <label for="mode-fancy" class="radio-btn-label">Do regex stuff</label>
      </li>
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
  return html`<h1>Regex test</h1>`
}

export const doStuffUI = (props) => {
  return html`<h1>Do regex stuff</h1>`
}

export const mainApp = (props) => {
  console.log('mainApp()')
  return html`
    ${header(!props.doRegex, props.change)}
    ${(props.doRegex) ? regexTestUI(props.tool) : doStuffUI(props.tool)}
    ${footer(props.buttons)}
  `
}
