import { html } from '../../lit-html/lit-html.mjs'
import { ucFirst } from '../../utility-functions.mjs'
import { getEventHandlers } from '../../state/repeatable.state.mjs'
import { store } from '../../state/regexMulti-state.mjs'

const getDebugGET = (debug) => (debug === true) ? '&debug=debug' : ''

const navLink = (_baseURL, _debug, _click) => (_action) => {
  return html`
    <li>
      <a href="${_baseURL}${_action.id}${_debug}" id="action--${_action.id}" title="${_action.description}" @click=${_click}>${_action.name}</a>
    </li>
  `
}

const eventHandlers = getEventHandlers(store.dispatch)

export const actionNav = (_open, _baseURL, _actions, _debug, _dispatch) => {
  const navClass = (_open === true) ? 'open' : 'close'

  return html`
    <button id="action-toggle" class="action-nav__toggle action-nav__toggle--${navClass}" @click=${getAutoDispatchToggleNav(_dispatch)}>${(_open === false) ? 'Open' : 'Close'}</button>
    <nav id="action-nav" class="action-nav action-nav--${navClass}">
      <ul>
        ${_actions.map(actionGroup => html`
          <li class="action-group">
            <h2 class="action-group__name">${actionGroup.name}</h2>
            <ul class="action-group__actions">
              ${actionGroup.actions.map(navLink(
                _baseURL,
                getDebugGET(_debug),
                getAutoDispatchSetAction(_dispatch)
              ))}
            </ul>
          </li>
        `)}
        <li>
          <button id="debug-toggle" class="action-debug__toggle action-debug__toggle-${(_debug === true) ? 'on' : 'off'}" @click=${getAutoDispatchToggleDebug(_dispatch)}>${ucFirst((_debug === false) ? 'On' : 'Off')}</button>
        </li>
      </ul>
    </nav>
  `
}
