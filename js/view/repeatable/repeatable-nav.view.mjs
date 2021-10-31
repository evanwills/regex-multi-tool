import { html } from '../../lit-html/lit-html.mjs'
import { stripGETaction } from '../../utilities/url.mjs'
import { ucFirst } from '../../utilities/sanitise.mjs'

const navLink = (_baseURL, _action, _click, currentActionID) => {
  return html`
    <li>
      <a href="${_baseURL.replace('[[ACTION_ID]]', _action.id)}" id="action--${_action.id}" title="${_action.description}" @click=${_click} class="action-nav__link${(currentActionID === _action.id) ? ' action-nav__link--active' : ''}">${_action.name}</a>
    </li>
  `
}

const navGroup = (actionGroup, href, eventHandler, currentActionID) => {
  return html`
    <li class="action-nav__group">
      <h2 class="action-nav__group-name">${ucFirst(actionGroup.name)}</h2>
      <ul class="list-clean list-clean--tight action-nav__actions">
        ${actionGroup.actions.map((action) => navLink(
          href,
          action,
          eventHandler,
          currentActionID
        ))}
      </ul>
    </li>`
}

export const repeatableActionNav = (_open, _baseURL, _actions, events, currentActionID) => {
  const navClass = (_open === true) ? 'opened' : 'closed'

  const _href = _baseURL.split('#')
  _href[0] = stripGETaction(_href[0])
  _href[0] += (_href[0].indexOf('?') > -1) ? '&' : '?'
  _href[0] += 'action=[[ACTION_ID]]'

  return html`
    <div class="action-nav__wrap action-nav--${navClass}">
      <button id="action-toggle" value="toggle-nav" class="action-nav__toggle action-nav__toggle--open action-nav__toggle--${navClass}" @click=${events.simpleEvent}>${(_open === false) ? 'Open' : 'Close'}</button>
      <nav id="action-nav" class="action-nav">
        <ul class="list-clean list-clean--tight">
          ${_actions.map((actionGroup) => navGroup(actionGroup, _href[0], events.hrefEvent, currentActionID))}
        </ul>
      </nav>
    </div>
    <button id="action-toggle" value="toggle-nav" class="action-nav__toggle action-nav__toggle--close action-nav__toggle--${navClass}" @click=${events.simpleEvent}>${(_open === false) ? 'Open' : 'Close'}</button>
    `
}

// &nabla;
// &Del;
// &#x02207;
// &#8711;

// &equiv;
// &Congruent;
// &#x02261;
// &#8801;
