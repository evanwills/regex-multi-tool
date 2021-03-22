import { html } from '../../lit-html/lit-html.mjs'
import { ucFirst, isNonEmptyStr } from '../../utility-functions.mjs'
import { store } from '../../state/regexMulti-state.mjs'
import { repeatableActionNav } from './repeatable-nav.view.mjs'

const getDebugGET = (debug) => (debug === true) ? '&debug=debug' : ''


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

const allExtraInputsView = (props, url) => {

}

export const repeatableUI = (props) => {
  let extraInputs
  let actionList = []

  if (Array.isArray(props.chainable)) {
    // blah
  } else {
    // blah
  }

  return html`
    <section>
      <h2>Repeatable regex actions</h2>

      ${repeatableActionNav(props.navOpen, props.href, props.allActions, props.events)}

      <h3>${props.name}</h3>

      ${(isNonEmptyStr(props.description)) ? html`<p>${props.description}</p>` : ''}
    </section>
  `
}
