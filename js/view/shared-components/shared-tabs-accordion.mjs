import { html } from '../lit-html/lit-html.mjs'
import { isStr, ucFirst } from '../utility-functions.mjs'

const tabNavItem = (groupID, activeID, props, eventHandler) => {
  const label = (isStr(props.label)) ? props.label : ucFirst(props.id)
  return html`
    <!-- START: tabNavItem() -->
    <li>
      <a href="#${props.id}" class="tab-nav__btn${(props.id === activeID) ? ' tab-nav__btn--active' : ''}" @click=${eventHandler} accesskey="${props.id.substr(0,1)}">${label}</a>
    </li>
    <!--  END:  tabNavItem() -->
  `
}

/**
 *
 * @param {array}    blocks   List of objects for each available tab block
 * @param {string}   activeID
 * @param {function} tabEvent
 * @returns
 */
export const tabBlock = (groupID, activeID, blocks, tabEvent) => {
  return html`
    <!-- START: tabBlock() -->
    <section class="tab-wrapper">
      <nav class="tab-nav">
        <ul class="clean-list tab-nav__list">
          ${blocks.map(block => tabNavItem(groupID, activeID, block, tabEvent))}
        </ul>
      </nav>
      ${blocks.filter(block => block.id === activeID).map(block => html`
        <section id="${block.id}">
          <h3>${block.label}</h3>
          ${block.view(block.data, block.events)}
        </section>
      `)}
    </section>
    <!--  END:  tabBlock() -->
  `
}
