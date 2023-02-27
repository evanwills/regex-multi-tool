import { html } from '../../lit-html/lit-html.mjs'

export const oneOffOutputView = (props, events) => {
  // console.log('props:', props);
  return html`<textarea id="setOutput" name="output" class="oneOff-input__input block xl">${props}</textarea>`
}
