import { html } from '../../lit-html/lit-html.mjs'
import { oneOffInputView } from './oneOff-input.view.mjs'
import { oneOffRegexView } from './oneOff-regex.view.mjs'
import { oneOffMatchesView } from './oneOff-matches.view.mjs'
import { oneOffOutputView } from './oneOff-output.view.mjs'
import { tabBlock } from '../shared-components/shared-tabs-accordion.view.mjs'

export const oneOffUI = (props) => {
  const blocks = [
    {
      id: 'input',
      label: 'Input'
    },
    {
      id: 'regex',
      label: 'Regex'
    }
  ]

  if (props.matches.length > 0) {
    blocks.push({
      id: 'matches',
      label: 'Matches'
    })
  }

  if (props.output !== '') {
    blocks.push({
      id: 'output',
      label: 'Output'
    })
  }

  switch (props.screen) {
    case 'regex':
      blocks[1].data = props[props.screen]
      blocks[1].view = oneOffRegexView
      blocks[1].events = props.events
      break

    case 'matches':
      if (typeof blocks[2] !== 'undefined') {
        blocks[2].view = oneOffMatchesView
        blocks[2].data = props[props.screen]
        break
      } else {
        props.screen = 'input'
      }

    case 'output': // eslint-disable-line
      if (typeof blocks[3] !== 'undefined') {
        blocks[3].view = oneOffOutputView
        blocks[3].data = props[props.screen]
        break
      } else {
        props.screen = 'input'
      }

    default: // eslint-disable-line
      props.screen = 'input'
      blocks[0].view = oneOffInputView
      blocks[0].data = props[props.screen]
      blocks[0].events = {
        simpleGeneral: props.events.simpleGeneral,
        generalValue: props.events.generalValue
      }
  }

  return html`
  <!-- START: oneOffUI() -->
  <h2>One-Off regex test</h2>

  <div class="oneOff">
    ${tabBlock(
      'oneOff',
      props.screen,
      blocks,
      props.events.navClick,
      true
    )}
  </div>
  <!--  END:  oneOffUI() -->
  `
}
