import { html } from '../lit-html/lit-html.mjs'
import { oneOffReducer } from '../state/oneOff/oneOff.state.reducers.mjs'
// import { oneOffInputView } from './oneOff-input.view.mjs'
import { oneOffInputView } from './oneOff-input.view.mjs'
import { oneOffRegexView } from './oneOff-regex.view.mjs'

export const oneOffUI = (props) => {
  console.log('props:', props)
  let screen

  switch (props.screen) {
    case 'input':
      screen = oneOffInputView
      break

    case 'regex':
      screen = oneOffRegexView
      break

    case 'matches':
      screen = oneOffMatchesView
      break

    case 'output':
      screen = oneOffOutputView
      break
  }

  return html`
  <!-- START: oneOffUI() -->
  <h1>Regex test</h1>

  <div class="oneOff">
    ${screen(props[props.screen], props.events)}
  </div>
  <!--  END:  oneOffUI() -->
  `
}
