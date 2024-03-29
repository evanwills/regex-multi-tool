import { html } from '../../lit-html/lit-html.mjs'
import { ucFirst } from '../../utilities/sanitise.mjs'
import { isStr, isBoolTrue } from '../../utilities/validation.mjs'
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
  // console.group('tabNavItem()')

  const label = (isStr(props.label))
    ? props.label
    : ucFirst(props.id)

  const aKey = (typeof props.aKey === 'string')
    ? props.aKey
    : props.id.substring(0, 1)

  // console.log('activeID:', activeID);
  // console.log('props.id:', props.id);
  // console.log('isActive:', (props.id === activeID));
  // console.groupEnd()
  return html`
    <!-- START: tabNavItem() -->
      <a href="#${props.id}" class="tab-nav__btn${(props.id === activeID) ? ' tab-nav__btn--active' : ''}${isBoolTrue(isAccordion) ? ' tab-nav--accordion' : ''}" @click=${eventHandler} accesskey="${aKey}">${label}</a>
    <!--  END:  tabNavItem() -->
  `
}

const tabBlockInner = (groupID, activeID, block, tabEvent) => {
  // console.group('tabBlockInner()')

  const isActive = (block.id === activeID)

  // console.log('activeID:', activeID);
  // console.log('block.id:', block.id);
  // console.log('isActive:', (block.id === activeID));
  // console.groupEnd()

  return html`
  <section id="${block.id}" class="tab-block tab-block--${(isActive) ? '' : 'in'}active">
    <h3 class="tab-block__h">${tabNavItem(groupID, activeID, block, tabEvent, true)}</h3>
    ${(isActive)
      ? html`${block.view(block.data, block.events)}`
      : ''
    }
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
  // console.group('tabBlock()')
  // console.log('activeID:', activeID);
  // console.groupEnd()

  return html`
    <!-- START: tabBlock() -->
    <section class="tab-wrapper ${isBoolTrue(isMobileAccordion) ? 'tab-wrapper--mobile' : 'tab-wrapper--tab'}">
      <nav class="tab-nav">
        <ul class="list-clean tab-nav__list">
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
