import { html } from '../lit-html/lit-html.mjs'
import { regexPair } from './oneOff-pair.view.mjs'


export const oneOffRegexView = (props, eventHandlers) => {

  return html`<section>
    <h2>Regular expressions</h2>
    <ul class="clean-list"></ul>
    ${props.pairs.map(pair => regexPair({...pair, events: eventHandlers}))}
  </section>`
}
