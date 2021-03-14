import { html } from '../lit-html/lit-html.mjs'
import { makeHTMLsafe } from '../utility-functions.mjs'
import { openCloseBtn, checkboxBtn } from './shared-components.mjs'
// import { getID } from '../state/utils.mjs'


export const oneOffInputView = (props, eventHandlers) => {
  const _index = (props.settingsOpen) ? 0 : -1

  return html`
  <!-- START: oneOffInputView() -->
  <section class="oneOff-input settings__wrap">
    <p>
      <label for="oneOff-input__text" class="sr-only">Input</label>
      <textarea id="input" name="input" class="oneOff-input__input block xl" placeholder="input/sample(s)">${makeHTMLsafe(props.raw)}</textarea>
    </p>
    ${openCloseBtn('input', 'Open', 'input', props.settingsOpen, eventHandlers.simpleGeneral)}
    <section class="oneOff-input__settings settings settings--${(props.settingsOpen) ? 'opened' : 'closed'}">
      <h2 id="sample-settings">Sample settings</h2>
      <ul class="clean-list">
        ${checkboxBtn('input-trim-before', 'Trim input before processing', 'trim-before', props.strip.before, eventHandlers.simpleGeneral, _index)}
        ${checkboxBtn('input-trim-after', 'Trim input after processing', 'trim-after', props.strip.after, eventHandlers.simpleGeneral, _index)}
        ${checkboxBtn('split-input', 'Split input when processing', 'split-input', props.split.doSplit, eventHandlers.simpleGeneral, _index)}
        ${(props.split.doSplit)
          ? html`<li class="oneOff-input__split">
            <label for="input-split-char">Character to split the sample with</label>
            <input type="text" id="input-split-char" value="${(props.split.splitter)}" @change=${eventHandlers.generalValue} class="oneOff-input__split__input" tabindex="${_index}" />
          </li>`
            : ''
          }
      </ul>
      ${openCloseBtn('input', 'Close', 'input', props.settingsOpen, eventHandlers.simpleGeneral)}
    </section>
  </section>
  <!--  END:  oneOffInputView() -->
  `
}
