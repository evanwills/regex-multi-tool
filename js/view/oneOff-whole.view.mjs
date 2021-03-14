import { html } from '../lit-html/lit-html.mjs'
import { oneOffReducer } from '../state/oneOff/oneOff.state.reducers.mjs'
// import { oneOffInputView } from './oneOff-input.view.mjs'
import { oneOffInputView } from './oneOff-input.view.mjs'
import { oneOffRegexView } from './oneOff-regex.view.mjs'
import { tabBlock } from './whole-tab-block.view.mjs'

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
    case 'input':
      blocks[0].view = oneOffInputView
      blocks[0].data = props[props.screen]
      blocks[0].events = {
        simpleGeneral: props.events.simpleGeneral,
        generalValue: props.events.generalValue
      }
      break

    case 'regex':
      blocks[1].data = props[props.screen]
      blocks[1].view = oneOffRegexView
      blocks[1].events = props.events
      break

    case 'matches':
      blocks[2].view = oneOffMatchesView
      blocks[2].data = props[props.screen]
      break

    case 'output':
      blocks[3].view = oneOffOutputView
      blocks[3].data = props[props.screen]
      break
  }



  return html`
  <!-- START: oneOffUI() -->
  <h1>Regex test</h1>

  <div class="oneOff">
    ${tabBlock(
      'oneOff',
      props.screen,
      blocks,
      props.events.navClick
    )}
  </div>
  <!--  END:  oneOffUI() -->
  `
}
