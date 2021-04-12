import { html } from '../../lit-html/lit-html.mjs'
import {
  // isInt,
  isNonEmptyStr
  // isStr,
} from '../../utilities/validation.mjs'
import { repeatableActionNav } from './repeatable-nav.view.mjs'
import { textInputField } from '../shared-components/shared-input-fields.view.mjs'
import { allExtraInputsView } from './repeatable-extraInputs.view.mjs'

/**
 * Get a template for "Repetable" action description
 *
 * NOTE: Because it's often useful to have HTML in a description
 *       and lit-html (or the browser/renderer) encodes any strings
 *       in the template, we need to bypass this by creating an HTML
 *       element and put the description in it.
 *
 * @param {string} description
 *
 * @returns {string}
 */
const renderDescription = (description) => {
  if (isNonEmptyStr(description)) {
    if (description.indexOf('<') > -1) {
      // Description contains HTML so put it in an HTML DOM element
      // to bypass renderer sanisation

      // If description already has a <P> tag, make the wrapper a
      // <DIV> otherswise make the wrapper a <P>
      const wrapper = (description.indexOf('<p') > -1) ? 'div' : 'p'
      const tmpDesc = document.createElement(wrapper)

      tmpDesc.className = 'repeatable-desc'
      tmpDesc.innerHTML = description

      return html`${tmpDesc}`
    } else {
      return html`<p class="repeatable-desc">${description}</p>`
    }
  }
  return ''
}

// const inputValue = (props) => {
//   if (props.debug === false && props.fields.outputPrimary !== '') {
//     console.log('returning primary output')
//     return props.fields.outputPrimary
//   } else {
//     console.log('returning primary input')
//     return props.fields.inputPrimary
//   }
// }

export const repeatableUI = (props) => {
  // let extraInputs
  // let actionList = []
  const _debug = props.debug
  const activeActionID = (typeof props.activeAction !== 'undefined' && isNonEmptyStr(props.activeAction.id))
    ? props.activeAction.id
    : ''
  const hasAction = isNonEmptyStr(props.activeAction.id)

  if (Array.isArray(props.chainable)) {
    // blah
  } else {
    // blah
  }
  // console.group('repeatableUI()')
  // console.log('props:', props)
  // console.groupEnd()

  return html`
    <section>
      <h2>Repeatable regex actions</h2>

      ${repeatableActionNav(
        (hasAction) ? props.navOpen : true,
        props.href,
        props.allActions,
        props.events,
        activeActionID)}

      <h3>${props.activeAction.name}</h3>

      ${renderDescription(props.activeAction.description)}
      <ul class="list-clean repeatable-field__wraper">
        ${allExtraInputsView(props.activeAction, props.extraInputs, props.events)}
      </ul>
      ${(hasAction)
        ? html`
        <div class="repeat-input">
        ${textInputField(
          {
            ...props.activeAction,
            label: props.activeAction.inputLabel,
            change: props.events.valueEvent,
            value: props.input,
            class: 'repeat-input',
            id: props.activeAction.id + '-primaryInput'
          },
          true
        )}
        ${(_debug)
          ? textInputField(
            {
              ...props.activeAction,
              label: props.activeAction.outputLabel,
              change: props.events.valueEvent,
              value: props.output,
              class: 'repeat-input',
              id: props.activeAction.id + '-primaryOutput'
            },
            true
          )
          : ''}

        </div>`
        : html`<p>Choose an action from the action menu (top right)</p>`
      }
    </section>
  `
}
