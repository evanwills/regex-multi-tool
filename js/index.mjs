import { render } from './lit-html/lit-html.mjs'
import { mainApp } from './view/templates.mjs'

const mainAppProps = {
  doRegex: false,
  change: null,
  tool: {},
  buttons: []
}

// const mainUiChanger = {
//   // handleEvent method is required.
//   handleEvent (e) {
//     console.log('mainUiChange clicked!')
//     console.log('this:', this)
//     mainAppProps.doRegex = (this.value === 'simple')
//     render(mainApp(mainAppProps))
//   }
//   // event listener objects can also define zero or more of the event
//   // listener options: capture, passive, and once.
//   // capture: true
// }

const mainUiChanger = (e) => {
  console.log('mainUiChange clicked!')
  console.log('this:', this)
  mainAppProps.doRegex = (this.value === 'simple')
  render(mainApp(mainAppProps))
}

mainAppProps.change = mainUiChanger

render(mainApp(mainAppProps), document.body)

console.log('index.mjs')
