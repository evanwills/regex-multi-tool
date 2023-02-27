import { html } from '../../lit-html/lit-html.mjs'
import { oneOffInputView } from './oneOff-input.view.mjs'
import { oneOffRegexView } from './oneOff-regex.view.mjs'
import { oneOffMatchesView } from './oneOff-matches.view.mjs'
import { oneOffOutputView } from './oneOff-output.view.mjs'
import { tabBlock } from '../shared-components/shared-tabs-accordion.view.mjs'

export const oneOffUI = (props) => {
  // console.group('oneOffUI()')
  const blocks = [
    {
      id: 'input',
      label: 'Input',
      akey: 'i'
    },
    {
      id: 'regex',
      label: 'Regex',
      aKey: 'p'
    }
  ]
  let i = -1

  if (props.matches.length > 0) {
    blocks.push({
      id: 'matches',
      label: 'Matches',
      aKey: 'm'
    })
  }

  if (props.output !== '') {
    blocks.push({
      id: 'output',
      label: 'Output',
      aKey: 'o'
    })
  }

  // console.log('props:', props)
  // console.log('props.screen:', props.screen)
  // console.log('blocks:', blocks)

  switch (props.screen) {
    case 'regex':
      blocks[1].data = props[props.screen]
      blocks[1].events = props.events
      blocks[1].view = oneOffRegexView
      break

    case 'matches':
      if (typeof blocks[2] !== 'undefined') {
        blocks[2].data = props[props.screen]
        blocks[2].view = oneOffMatchesView
        break
      } else {
        props.screen = 'input'
      }

    case 'output': // eslint-disable-line
      // console.group('oneOffUI() - "output"');
      // console.log('props.screen:', props.screen)
      // console.log('typeof blocks[3]:', typeof blocks[3])
      if (typeof blocks[3] !== 'undefined' && blocks[3].id === 'output') {
        i = 3
      } else if (typeof blocks[2] !== 'undefined' && blocks[2].id === 'output') {
        i = 2
      }
      if (i > -1) {
        blocks[i].data = props[props.screen]
        blocks[i].view = oneOffOutputView
        break
      } else {
        props.screen = 'input'
      }
      // console.groupEnd();

    default: // eslint-disable-line
      props.screen = 'input'
      blocks[0].data = props[props.screen]
      blocks[0].events = {
        simpleGeneral: props.events.simpleGeneral,
        generalValue: props.events.generalValue
      }
      blocks[0].view = oneOffInputView
  }
  // console.log('props.screen:', props.screen)
  // console.groupEnd();
  return html`
  <!-- START: oneOffUI() -->
  <h2 class="tool-heading">One-Off regex test</h2>
  <p class="alert alert--note">Regex Multi Tool's <em>OneOff</em> mode is not yet working for "TEST".</p>
  <div class="oneOff">
    ${tabBlock(
      'oneOff',
      props.screen,
      blocks,
      props.events.navClick,
      false // use mobile accordion
    )}
  </div>
  <!--  END:  oneOffUI() -->
  `
}
