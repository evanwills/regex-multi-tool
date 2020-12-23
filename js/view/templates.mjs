import { html } from '../lit-html/lit-html.mjs'

export let doRegex = false

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
  return html`
  <header>
    <h1>Regex multi tool</h1>
    <h2>${(_isFancy === true) ? 'Regex tester' : 'Do regex stuff'}</h2>

    <ul>
      <li>
        <input type="radio" id="mode-simple" name="mode" value="simple" ?checked=${!_isFancy} @onChange=${changeHandler} />
        <label for="mode-simple">Regex tester</label>
      </li>
      <li>
        <input type="radio" id="mode-fancy" name="mode" value="fancy" ?checked=${_isFancy} @onChange=${changeHandler} />
        <label for="mode-simple">Do regex stuff</label>
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
        <button name=${$button.name} id=${$button.name} .value="${button.value}" @click=${button.click}>
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


export const mainApp = (isFancy, changeHandler, toolProps, buttons) => {
  return html`
    ${header(isFancy, changeHandler)}
    ${(isFancy) ? doStuffUI(toolProps) : regexTestUI(toolProps)}
    ${footer(buttons)}
  `
}
