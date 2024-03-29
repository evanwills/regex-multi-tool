import { html } from '../../lit-html/lit-html.mjs'
// import { makeHTMLsafe } from '../../utilities/sanitise.mjs'
import { openCloseBtn } from '../shared-components/shared-openClose-btn.view.mjs'
import { checkboxBtn } from '../shared-components/shared-checkbox-btn.view.mjs'
// import { getID } from '../state/utils.mjs'

export const oneOffInputView = (props, eventHandlers) => {
  const _isOpen = props.settingsOpen
  const _index = (_isOpen) ? 0 : -1

  return html`
    <!-- START: oneOffInputView() -->
    <section class="oneOff-input settings__wrap">
      <p>
        <label for="oneOff-input__text" class="sr-only">Input</label>
        <textarea id="setInput" name="input" class="oneOff-input__input block xl" placeholder="input/sample(s)" @change=${eventHandlers.generalValue}>${props.raw}</textarea>
      </p>
      ${openCloseBtn('input', 'Open', 'input', _isOpen, eventHandlers.simpleGeneral, 0, 'sm')}
      <section class="oneOff-input__settings settings settings--${(_isOpen) ? 'opened' : 'closed'}">
        <h2 id="sample-settings">Sample settings</h2>
        <ul class="list-clean">
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
        ${openCloseBtn('input', 'Close', 'input', _isOpen, eventHandlers.simpleGeneral, _index, 'sm')}
      </section>
    </section>
    <!--  END:  oneOffInputView() -->
    `
}
