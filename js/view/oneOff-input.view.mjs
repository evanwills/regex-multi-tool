import { html } from '../lit-html/lit-html.mjs'
import { makeHTMLsafe } from '../utility-functions.mjs'
import { openCloseButton } from './shared-components.mjs'
// import { getID } from '../state/utils.mjs'


export const oneOffInputView = (props, eventHandlers) => {
  console.group('oneOffInputView')
  console.log('props:', props)
  console.log('eventHandlers:', eventHandlers)
  console.groupEnd()
  const _index = (props.settingsOpen) ? 0 : -1
  return html`
  <section class="oneOff-input">
    <p>
      <label for="oneOff-input__text">Sample(s)</label>
      <textarea id="input" name="input" class="oneOff-input__input">${makeHTMLsafe(props.raw)}</textarea>
    </p>
    ${openCloseButton('input', 'input', 'Open', props.settingsOpen, eventHandlers.simpleGeneral)}
    <section class="oneOff-input__settings oneOff-input__settings--${(props.settingsOpen) ? 'open' : 'closed'}">
      <h2 id="sample-settings">Sample settings</h2>
      <ul class="clean-list">
        <li>
          <input type="checkbox" id="input-trim-before" value="trim-before" class="cb-btn__input" ?checked=${(props.strip.before)} @change=${eventHandlers.simpleGeneral} tabindex="${_index}" />
          <label for="input-trim-before" class="cb-btn__label">Trim sample(s) before processing</label>
        </li>
        <li>
          <input type="checkbox" id="input-trim-after" value="trim-after" class="cb-btn__input" ?checked=${(props.strip.after)} @change=${eventHandlers.simpleGeneral} tabindex="${_index}" />
          <label for="input-trim-after" class="cb-btn__label">Trim sample(s) after processing</label>
        </li>
        <li>
          <input type="checkbox" id="input-split" value="split-input" class="cb-btn__input" ?checked=${(props.split.doSplit)} @change=${eventHandlers.simpleGeneral} tabindex="${_index}" />
          <label for="input-split" class="cb-btn__label">Split samples when processing</label>
        </li>
        ${(props.split.doSplit)
          ? html`<li class="oneOff-input__split">
            <label for="input-split-char">Character to split the sample with</label>
            <input type="text" id="input-split-char" value="${(props.split.splitter)}" @change=${eventHandlers.generalValue} class="oneOff-input__split__input" tabindex="${_index}" />
          </li>`
            : ''
          }
      </ul>
      ${openCloseButton('input', 'input', 'close', props.settingsOpen, eventHandlers.simpleGeneral)}
    </section>
  </section>
  `
}
