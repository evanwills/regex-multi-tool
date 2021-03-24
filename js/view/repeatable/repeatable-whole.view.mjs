import { html } from '../../lit-html/lit-html.mjs'
import { ucFirst, isNonEmptyStr } from '../../utility-functions.mjs'
import { store } from '../../state/regexMulti-state.mjs'
import { repeatableActionNav } from './repeatable-nav.view.mjs'

export const singleExtraInputView = (props, url) => {
  const id = props.id
  let get = ''
  if (typeof url.searchParams[id] !== 'undefined') {
    get = url.searchParams[id]
  }

  switch (props.type) {
    case 'textarea':
      break

    case 'number':
      break

    case 'radio':
      break

    case 'checkbox':
      break

    case 'select':
      break

    case 'text':
    default:
      break
  }
}

const allExtraInputsView = (props, searchParams) => {
  return ''
}

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

export const repeatableUI = (props) => {
  let extraInputs
  let actionList = []
  const activeActionID = (typeof props.activeAction !== 'undefined' && isNonEmptyStr(props.activeAction.id)) ? props.activeAction.id : ''

  if (Array.isArray(props.chainable)) {
    // blah
  } else {
    // blah
  }
  console.log('pops:', props)
  return html`
    <section>
      <h2>Repeatable regex actions</h2>

      ${repeatableActionNav(
        props.navOpen,
        props.href,
        props.allActions,
        props.events,
        activeActionID)}

      <h3>${props.activeAction.name}</h3>

      ${renderDescription(props.activeAction.description)}
      ${allExtraInputsView(props.activeAction)}
    </section>
  `
}
