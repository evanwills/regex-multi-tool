import { html, render } from '../lit-html/lit-html.mjs'
import { oneOffUI } from './oneOff/oneOff-whole.view.mjs'
// import { regexPair } from './oneOff-pair.view.mjs'
// import { regexPair } from './repeatable.view.mjs'
import { getEventHandlers as getOneOffEventHandlers } from '../state/oneOff/oneOff.state.mjs'
import { getEventHandlers as getRepeatableEventHandlers } from '../state/repeatable/repeatable.state.mjs'
import { getAutoDispatchMainAppEvent } from '../state/main-app/main-app.state.actions.mjs'
// import { eventHandlers } from './repeatable/repeatable-whole.view.mjs'
import { checkboxBtn } from './shared-components/shared-checkbox-btn.view.mjs'
import { getUIEventHandlers } from '../state/user-settings/user-settings.state.mjs'
import { openCloseBtn } from './shared-components/shared-openClose-btn.view.mjs'

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

export const footer = (buttons, eventHandler, userSettings) => {
  return html`
  <footer class="regex-multi__footer">
    <ul class="action-btns">
      ${buttons.map(button => {
        const _name = button.toLowerCase()
        const _akey = (_name === 'reset')
          ? 'x'
          : (_name === 'replace') ? 's' : _name.substr(0, 1)
        return html`
          <li class="btn-wrap btn-wrap--${button.name}">
            <button name=${_name} class="main-btn main-btn--${_name}" id=${_name} .value="${_name}" @click=${eventHandler} accesskey="${_akey}">
              ${button}
            </button>
          </li>
        `
      })}
    </ul>
    ${userSettings}
  </footer>
  `
}

const userSettingsUI = (props, eventHandlers) => {
  const isOpen = props.settingsOpen
  const tabIndex = (isOpen) ? 0 : -1
  const px = (props.fontSize * 16)

  return html`
  ${openCloseBtn('user-settings', 'Open', 'user interface', isOpen, eventHandlers.simpleEvent, tabIndex)}
  <div class="ui-settings settings settings--${(isOpen) ? 'opened' : 'closed'}" aria-hidden="${isOpen ? 'false' : 'true'}">
    <div role="group" aria-labelledby="user-general-settings" class="ui-settings__general">
      <h2 id="user-general-settings" class="ui-settings__h ui-settings__h--1">General settings</h2>
      <ul class="clean-list">
        ${checkboxBtn('user-debug', 'Debug mode', 'debugMode', props.debug, eventHandlers.simpleEvent, tabIndex)}
        ${checkboxBtn('user-localStorage', 'Save state locally', 'localStorage', props.localStorage, eventHandlers.simpleEvent, tabIndex)}
        ${checkboxBtn('user-darkMode', (props.darkMode) ? 'Dark mode' : 'Light mode', 'darkMode', props.darkMode, eventHandlers.simpleEvent, tabIndex)}
      </ul>
    </div>
    <div role="group" aria-labelledby="user-UI-settings" class="ui-settings__ui">
      <h2 id="user-UI-settings" class="ui-settings__h ui-settings__h--2">User interface settings</h2>
      <ul class="clean-list">
        <li class="input-pair">
          <label for="set-fontSize" class="input-pair__label">Font size:</label><!--
          --><input type="range" id="set-fontSize" class="input-pair__input" value="${px}" min="8" max="40" step="1" placeholder="px" tabindex="${tabIndex}" @change=${eventHandlers.valueEvent} /><!--
          --><span class="input-pair__suffix">${px}px</span>
        </li>
        <li class="input-pair">
          <label for="set-darkMode-bg" class="input-pair__label">Dark mode background colour:</label><!--
          --><input type="color" id="set-darkMode-bg" class="input-pair__input" value="${props.darkModeBg}" tabindex="${tabIndex}" @change=${eventHandlers.valueEvent} /><!--
          --><span class="input-pair__suffix" style="background-color: ${props.darkModeBg};">&nbsp;</span>
        </li>
        <li class="input-pair">
          <label for="set-darkMode-txt" class="input-pair__label">Dark mode text colour:</label><!--
          --><input type="color" id="set-darkMode-txt" class="input-pair__input" value="${props.darkModeTxt}" tabindex="${tabIndex}" @change=${eventHandlers.valueEvent} /><!--
          --><span class="input-pair__suffix" style="background-color: ${props.darkModeTxt};">&nbsp;</span>
        </li>
        <li class="input-pair">
          <label for="set-lightMode-bg" class="input-pair__label">Light mode background colour:</label><!--
          --><input type="color" id="set-lightMode-bg" class="input-pair__input" value="${props.lightModeBg}" tabindex="${tabIndex}" @change=${eventHandlers.valueEvent} /><!--
          --><span class="input-pair__suffix" style="background-color: ${props.lightModeBg};">&nbsp;</span>
        </li>
        <li class="input-pair">
          <label for="set-lightMode-txt" class="input-pair__label">Light mode text colour:</label><!--
          --><input type="color" id="set-lightMode-txt" class="input-pair__input" value="${props.lightModeTxt}" tabindex="${tabIndex}" @change=${eventHandlers.valueEvent} /><!--
          --><span class="input-pair__suffix" style="background-color: ${props.lightModeTxt};">&nbsp;</span>
        </li>
      </ul>
    </div>

    ${openCloseBtn('user-settings', 'close', 'user interface', isOpen, eventHandlers.simpleEvent, tabIndex)}
  </div>
  `
}

export const repeatableUI = (props) => {
  return html`<h1>Do regex stuff</h1>`
}

export const getMainAppView = (domNode, store) => {
  return function () {
    const props = store.getState()
    const mainEvent = getAutoDispatchMainAppEvent(store.dispatch)
    const userSettingsEvent = getUIEventHandlers(store.dispatch)
    const isSimple = (props.mode === 'oneOff')

    const eventHandlers = (isSimple)
      ? getOneOffEventHandlers(store.dispatch)
      : getRepeatableEventHandlers(store.dispatch)

    const state = (isSimple)
      ? props.oneOff
      : props.repeatable

    const newProps = { ...state, events: { ...eventHandlers } }

    const buttons = (isSimple)
      ? ['Test', 'Replace', 'Reset']
      : ['Modify', 'Reset']

    // console.log('mainApp()')
    // console.log('newProps:', newProps)

    const UI = html`
      ${header(isSimple, mainEvent)}
      ${(isSimple) ? oneOffUI(newProps) : repeatableUI(newProps)}
      ${footer(
        buttons,
        mainEvent,
        userSettingsUI(props.userSettings, userSettingsEvent)
      )}
    `
    render(UI, domNode)
  }
}
