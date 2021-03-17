import { html } from '../../lit-html/lit-html.mjs'
import { isStr, ucFirst, boolTrue } from '../../utility-functions.mjs'
/**
 *
 * @param {string}   groupID
 * @param {string}   activeID
 * @param {object}   props
 * @param {function} eventHandler
 * @param {boolean}  isAccordion
 * @returns
 */
const tabNavItem = (groupID, activeID, props, eventHandler, isAccordion) => {
  const label = (isStr(props.label)) ? props.label : ucFirst(props.id)
  return html`
    <!-- START: tabNavItem() -->
      <a href="#${props.id}" class="tab-nav__btn${(props.id === activeID) ? ' tab-nav__btn--active' : ''}${boolTrue(isAccordion) ? ' tab-nav--accordion' : ''}" @click=${eventHandler} accesskey="${props.id.substr(0, 1)}">${label}</a>
    <!--  END:  tabNavItem() -->
  `
}

const tabBlockInner = (groupID, activeID, block, tabEvent) => {
  const isActive = (block.id === activeID)
  return html`
  <section id="${block.id}" class="tab-block tab-block--${(isActive) ? '' : 'in'}active">
    <h3 class="tab-block__h">${tabNavItem(groupID, activeID, block, tabEvent, true)}</h3>
    ${(isActive) ? html`${block.view(block.data, block.events)}` : ''}
  </section>
`
}

/**
 *
 * @param {array}    blocks   List of objects for each available tab block
 * @param {string}   activeID
 * @param {function} tabEvent
 * @returns
 */
export const tabBlock = (groupID, activeID, blocks, tabEvent, isMobileAccordion) => {
  return html`
    <!-- START: tabBlock() -->
    <section class="tab-wrapper${boolTrue(isMobileAccordion) ? ' tab-wrapper--mobile' : ''}">
      <nav class="tab-nav">
        <ul class="clean-list tab-nav__list">
          ${blocks.map(block => html`
          <li>
            ${tabNavItem(groupID, activeID, block, tabEvent)}
          </li>
        `)}
        </ul>
      </nav>
      ${blocks.map(block => tabBlockInner(groupID, activeID, block, tabEvent))}
    </section>
    <!--  END:  tabBlock() -->
  `
}
