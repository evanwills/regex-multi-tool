import { html } from '../../lit-html/lit-html.mjs'
import { ucFirst } from '../../utility-functions.mjs'

const navLink = (_baseURL, _action, _click) => {
  return html`
    <li>
      <a href="${_baseURL.replace('[[ACTION_ID]]', _action.id)}" id="action--${_action.id}" title="${_action.description}" @click=${_click}>${_action.name}</a>
    </li>
  `
}

const navGroup = (actionGroup, href, eventHandler) => {
  return html`
    <li class="action-group">
      <h2 class="action-group__name">${ucFirst(actionGroup.name)}</h2>
      <ul class="action-group__actions">
        ${actionGroup.actions.map((action) => navLink(
          href,
          action,
          eventHandler
        ))}
      </ul>
    </li>`
}

export const repeatableActionNav = (_open, _baseURL, _actions, events) => {
  const navClass = (_open === true) ? 'open' : 'close'

  const _href = _baseURL.split('#')
  _href[0] += (_href[0].indexOf('?') > -1) ? '&' : '?'
  _href[0] += 'action=[[ACTION_ID]]'

  return html`
    <button id="action-toggle" class="action-nav__toggle action-nav__toggle--${navClass}" @click=${events.simpleEvent}>${(_open === false) ? 'Open' : 'Close'}</button>
    <nav id="action-nav" class="action-nav action-nav--${navClass}">
      <ul>
        ${_actions.map((actionGroup) => navGroup(actionGroup, _href.join(''), events.hrefEvent))}
      </ul>
    </nav>
    `
}
