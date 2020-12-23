import { render } from '../lit-html/lit-html.js'
import { header } from './view/templates.js'

render(
  mainApp(
    false,
    (e) => { console.log('Button was pressed') },
    []
  ),
  document.body
)
