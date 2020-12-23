import { render } from './lit-html/lit-html.mjs'
import { header } from './view/templates.mjs'

render(
  mainApp(
    false,
    (e) => { console.log('Button was pressed') },
    []
  ),
  document.body
)
