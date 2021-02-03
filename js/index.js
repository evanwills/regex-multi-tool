import { render } from 'lit-html'
import { mainApp } from './view/templates.mjs'
import { getNewPair } from './view/regex-pair.mjs'

const mainAppProps = {
  simple: true,
  change: null,
  tool: getNewPair(),
  buttons: []
}

function mainUiChanger (e) {
  if (this.value === 'simple') {
    mainAppProps.simple = true
    mainAppProps.tool = getNewPair()
  } else {
    mainAppProps.simple = false
    mainAppProps.tool = {}
  }

  render(mainApp(mainAppProps), document.body)
}

mainAppProps.change = mainUiChanger
console.log('mainAppProps:', mainAppProps)

render(mainApp(mainAppProps), document.body)

console.log('index.mjs')
