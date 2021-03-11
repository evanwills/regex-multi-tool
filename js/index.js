// import { render } from './lit-html/lit-html.mjs'
// import { mainApp } from './view/templates.mjs'
// import { getNewPair } from './view/oneOff-pair.mjs'
// import { redux } from './redux/redux.mjs'
import { store } from './state/regexMulti-state.mjs'
import { mainApp } from './view/templates.mjs'

// const mainAppProps = {
//   simple: true,
//   change: function (e) {},
//   tool: getNewPair(),
//   buttons: []
// }

// function mainUiChanger (e) {
//   if (this.value === 'simple') {
//     mainAppProps.simple = true
//     mainAppProps.tool = getNewPair()
//   } else {
//     mainAppProps.simple = false
//     mainAppProps.tool = {}
//   }

//   render(mainApp(mainAppProps), document.body)
// }

// mainAppProps.change = mainUiChanger
// console.log('mainAppProps:', mainAppProps)

// render(mainApp(mainAppProps), document.body)

// console.log('index.mjs')

console.log('store:', store)
