import { html, render } from '../lit-html/lit-html.mjs'
import { oneOffUI } from './oneOff-whole.view.mjs'
// import { regexPair } from './oneOff-pair.view.mjs'
// import { regexPair } from './repeatable.view.mjs'
import { getEventHandlers as getOneOffEventHandlers } from '../state/oneOff/oneOff.state.mjs'
import { getEventHandlers as getRepeatableEventHandlers } from '../state/repeatable/repeatable.state.mjs'
import { mainAppActions, getAutoDispatchMainAppEvent } from '../state/main-app/main-app.state.actions.mjs'
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
        --><input type="radio" id="mode-simple" name="mode" value="oneOff" class="radio-btn__input" ?checked=${!_isFancy} @change=${changeHandler} accesskey="o" /><!--
        --><label for="mode-simple" class="btn-list__btn radio-btn__label">One-off</label><!--
      --></li>
      <li><!--
        --><input type="radio" id="mode-fancy" name="mode" value="repeatable" class="radio-btn__input" ?checked=${_isFancy} @change=${changeHandler} accesskey="s" /><!--
        --><label for="mode-fancy" class="btn-list__btn radio-btn__label">Repeatable</label><!--
        --></li>
    </ul>
  </header>`
}

export const footer = (buttons, eventHandler) => {
  return html`
  <footer class="regex-multi__footer">
    <ul class="action-btns">
      ${buttons.map(button => {
        const _name = button.toLowerCase()
        const _akey = (_name === 'reset')
          ?  'x'
          : (_name === 'replace') ? 's' : _name.substr(0,1)
        return html`
          <li class="btn-wrap btn-wrap--${button.name}">
            <button name=${_name} class="main-btn main-btn--${_name}" id=${_name} .value="${_name}" @click=${eventHandler} accesskey="${_akey}">
              ${button}
            </button>
          </li>
        `
      })}
    </ul>
  </footer>
  `
}


export const repeatableUI = (props) => {
  return html`<h1>Do regex stuff</h1>`
}


export const getMainAppView = (domNode, store) => {
  return function () {
    const props = store.getState()
    const mainEvent = getAutoDispatchMainAppEvent(store.dispatch)
    const isSimple =  (props.mode === 'oneOff')

    const eventHandlers = (isSimple)
      ? getOneOffEventHandlers(store.dispatch)
      : getRepeatableEventHandlers(store.dispatch)

    const state = (isSimple)
      ? props.oneOff
      : props.repeatable

    const newProps = { ...state, events: { ...eventHandlers } }

    const buttons = (isSimple) ? [ 'Test', 'Replace', 'Reset' ] : [ 'Modify', 'Reset' ]

    // console.log('mainApp()')
    // console.log('newProps:', newProps)

    const UI = html`
      ${header(isSimple, mainEvent)}
      ${(isSimple) ? oneOffUI(newProps) : repeatableUI(newProps)}
      ${footer(buttons, mainEvent)}
    `
    render(UI, domNode)
  }
}
