import { html } from 'lit-html'
import { ucFirst } from '../state/utils.mjs'
import { store } from '../state/index.mjs'
import { getAutoDispatchSetAction } from '../state/repeat.state'

const actionLinkClick = getAutoDispatchSetAction(store)

export const navLink = (_action, baseURL, debug) => {
  return html`
    <li>
      <a href="${baseURL}${_action.id}${debug}" id="action--${_action.id}" title="${_action.description}" @click=${actionLinkClick}>${_action.name}</a>
    </li>
  `
}

export const actionNav = (_open, _baseURL, _actions, _debug) => {
  const navState = (_open === true) ? 'open' : 'close'
  return html`
    <button id="action-toggle" class="action-nav__toggle action-nav__toggle--${navState}">${ucFirst(navState)}</button>
    <nav id="action-nav" class="action-nav action-nav--${navState}">
      <ul>
        ${_actions.map(actionGroup => html`
          <li class="action-group">
            <h2 class="action-group__name">${actionGroup.name}</h2>
            <ul class="action-group__actions">
              ${actionGroup.actions.map(action => html`${navLink(action, _baseURL, _debug)}`)}
            </ul>
          </li>
        `)}
      </ul>
    </nav>
  `
}
