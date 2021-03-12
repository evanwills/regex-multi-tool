import { html, render } from '../lit-html/lit-html.mjs'
import { regexPair } from './oneOff-pair.view.mjs'
// import { regexPair } from './oneOff-pair.view.mjs'
// import { regexPair } from './repeatable.view.mjs'
import { getEventHandlers as getOneOffEventHandlers } from '../state/oneOff/oneOff.state.mjs'
import { getEventHandlers as getRepeatableEventHandlers } from '../state/repeatable/repeatable.state.mjs'
import { store } from '../state/regexMulti-state.mjs'

/**
 * Template for header block for Regex multi tool
 *
 * @param {boolean}  isSimple
 * @param {function} changeHandler
 *
 * @returns {html} lit-html template function
 */
export const header = (isSimple, changeHandler) => {
  const _isFancy = (typeof isSimple === 'boolean' && isSimple === false)

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

export const oneOffUI = (props) => {
  console.log('props:', props)

  return html`<h1>Regex test</h1>
  ${props.regex.pairs.map(pair => regexPair({...pair, events: props.events }))}`
}

export const repeatableUI = (props) => {
  return html`<h1>Do regex stuff</h1>`
}


export const getMainAppView = (domNode, store) => {
  return function () {
    const props = store.getState()
    const isSimple =  (props.mode === 'oneOff')

    const eventHandlers = (isSimple)
      ? getOneOffEventHandlers(store.dispatch)
      : getRepeatableEventHandlers(store.dispatch)

    const state = (isSimple)
      ? props.oneOff
      : props.repeatable

    const newProps = { ...state, events: { ...eventHandlers } }

    // console.log('mainApp()')
    // console.log('newProps:', newProps)

    const UI = html`
      ${header(isSimple, props.change)}
      ${(isSimple) ? oneOffUI(newProps) : repeatableUI(newProps)}
      ${footer([])}
    `
    render(UI, domNode)
  }
}
