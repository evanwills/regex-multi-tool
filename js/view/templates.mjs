import { html, render } from '../lit-html/lit-html.mjs'
import { isBoolTrue } from '../utilities/validation.mjs'
import { oneOffUI } from './oneOff/oneOff-whole.view.mjs'
// import { regexPair } from './oneOff-pair.view.mjs'
// import { regexPair } from './repeatable.view.mjs'
import { getOneOffEventHandlers } from '../state/oneOff/oneOff.state.actions.mjs'
import { getRepeatableEventHandlers } from '../state/repeatable/repeatable.state.actions.mjs'
import { getAutoDispatchMainAppEvent } from '../state/main-app/main-app.state.actions.mjs'
// import { eventHandlers } from './repeatable/repeatable-whole.view.mjs'
import { checkboxBtn, radioBtnGroup } from './shared-components/shared-checkbox-btn.view.mjs'
import { getUIEventHandlers } from '../state/user-settings/user-settings.state.mjs'
import { openCloseBtn } from './shared-components/shared-openClose-btn.view.mjs'
import { colourInput } from './shared-components/shared-input-fields.view.mjs'
import { repeatableUI } from './repeatable/repeatable-whole.view.mjs'

/**
 * Template for header block for Regex multi tool
 *
 * @param {boolean}  isOneOff
 * @param {function} changeHandler
 *
 * @returns {html} lit-html template function
 */
export const header = (isOneOff, changeHandler) => {
  const _isOneOff = isBoolTrue(isOneOff)

  // NOTE: the empty HTML comments within the unordered list
  //       are there because the white space they omit causes
  //       issues with the layout if not removed.

  return html`
  <header class="regex-multi__header">
    <h1 class="header-1">Regex multi-tool</h1>
    <!-- <h2 class="header1">${(_isOneOff === false) ? 'Do regex stuff' : 'Regex tester'}</h2> -->

    <ul class="radio-grp list-clean list-clean--tight list-inline mode-control"><!--
      --><li><!--
        --><input type="radio" id="mode-simple" name="mode" value="oneOff" class="radio-grp__input" ?checked=${_isOneOff} @change=${changeHandler} accesskey="o" /><!--
        --><label for="mode-simple" class="radio-grp__label">One-off</label><!--
      --></li>
      <li><!--
        --><input type="radio" id="mode-fancy" name="mode" value="repeatable" class="radio-grp__input" ?checked=${!_isOneOff} @change=${changeHandler} accesskey="s" /><!--
        --><label for="mode-fancy" class="radio-grp__label">Repeatable</label><!--
        --></li><!--
    --></ul>
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

const uiModeButtons = (uiMode, eventHandler, tabIndex) => {
  const modes = ['Dark', 'Light', 'Custom']

  const btns = modes.map(mode => {
    const _id = mode.toLowerCase()
    return {
      value: _id + 'Mode',
      label: mode
    }
  })

  return radioBtnGroup(
    'ui-mode',
    'Theme',
    uiMode,
    btns,
    eventHandler,
    tabIndex
  )
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
      <ul class="list-clean">
        ${checkboxBtn('user', 'Debug mode', 'debugMode', props.debug, eventHandlers.simpleEvent, tabIndex)}
        ${checkboxBtn('user', 'Save state locally', 'localStorage', props.localStorage, eventHandlers.simpleEvent, tabIndex)}
        <li class="input-pair input-pair--top-2">
          <label for="set-fontSize" class="input-pair__label">Font size:</label><!--
          --><input type="range" id="set-fontSize" class="input-pair__input" value="${px}" min="8" max="40" step="1" placeholder="px" tabindex="${tabIndex}" @change=${eventHandlers.valueEvent} /><!--
          --><span class="input-pair__suffix">${px}px</span>
        </li>
      </ul>
    </div>
    <div role="group" aria-labelledby="user-UI-settings" class="ui-settings__ui">
      <h2 id="user-UI-settings" class="ui-settings__h ui-settings__h--2">Theme settings</h2>
      <ul class="list-clean">
        <li>
          ${uiModeButtons(props.uiMode, eventHandlers.valueEvent, tabIndex)}
        </li>
        ${(props.uiMode === 'customMode')
          ? html`
            ${colourInput({
              id: 'bg',
              label: 'background',
              value: props.customBG,
              eventHandler: eventHandlers.valueEvent,
              tabIndex: tabIndex
            })}
            ${colourInput({
              id: 'txt',
              label: 'text',
              value: props.customTxt,
              eventHandler: eventHandlers.valueEvent,
              tabIndex: tabIndex
            })}
            ${colourInput({
              id: 'over',
              label: 'overlay',
              value: props.customOver,
              eventHandler: eventHandlers.valueEvent,
              tabIndex: tabIndex
            })}
            ${colourInput({
              id: 'rev',
              label: 'reverse overlay',
              value: props.customRev,
              eventHandler: eventHandlers.valueEvent,
              tabIndex: tabIndex
            })}`
          : ''}
      </ul>
    </div>

    ${openCloseBtn('user-settings', 'close', 'user interface', isOpen, eventHandlers.simpleEvent, tabIndex)}
  </div>
  `
}

export const getMainAppView = (domNode, store) => {
  return function () {
    const props = store.getState()
    const mainEvent = getAutoDispatchMainAppEvent(store.dispatch)
    const userSettingsEvent = getUIEventHandlers(store.dispatch)
    const isOneOff = (props.mode === 'oneOff')

    const eventHandlers = (isOneOff)
      ? getOneOffEventHandlers(store.dispatch)
      : getRepeatableEventHandlers(store.dispatch)

    const state = (isOneOff)
      ? props.oneOff
      : props.repeatable


    const newProps = {
      ...state,
      events: { ...eventHandlers },
      input: {
        ...state.input,
        raw: props.input
      },
      output: props.output,
      debug: props.debug
    }

    if (!isOneOff) {
      newProps.href = props.url.actionHref
      // newProps.get = props.url.searchParams
    }

    const buttons = (isOneOff)
      ? ['Test', 'Replace', 'Reset']
      : ['Modify', 'Reset']

    const UI = html`
      <div class="regex-multi ui-${props.userSettings.uiMode} ${(props.mode === 'oneOff') ? 'oneOff' : 'repeatable'}-mode">
        ${header(isOneOff, mainEvent)}
        <main>
          ${(isOneOff) ? oneOffUI(newProps) : repeatableUI(newProps)}
        </main>
        ${footer(
          buttons,
          mainEvent,
          userSettingsUI(props.userSettings, userSettingsEvent)
        )}
      </div>
    `
    render(UI, domNode)
  }
}
