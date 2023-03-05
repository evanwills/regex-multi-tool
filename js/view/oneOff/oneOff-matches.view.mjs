import { html } from '../../lit-html/lit-html.mjs'

const renderSingleSub = (match) => {
  // console.group('renderSingleSub()')
  // console.log('match:', match)
  // console.log('typeof match.str:', typeof match.str)
  // console.log('typeof match.str === "undefined":', typeof match.str === 'undefined')

  const noMatch = (typeof match.str === 'undefined' || match.str === null || match.str === '')
  const str = (noMatch === true)
    ? 'not matched'
    : match.str
  const extraClass = (noMatch === true)
    ? ' sub-patterns__captured-empty'
    : ''

  // console.log('noMatch:', noMatch)
  // console.log('str:', str)
  // console.log('extraClass:', extraClass)
  // console.groupEnd()
  return html`
    <li class="sub-patterns__item">
      ${(match.key !== '') ? html`<span class="sub-patterns__key"><span>${match.key}</span></span>` : ''}
      <span class="sub-patterns__captured${extraClass}">${str}</span>
    </li>`
}

const renderCaptured = (matches) => {
  console.group('renderCaptured()')
  let _matches = [...matches]
  let whole = matches.filter(match => match.key === '__WHOLE__')
  if (whole.length === 0) {
    whole = _matches.shift()
  } else {
    _matches = matches.filter(match => match.key !== '__WHOLE__')
  }

  const notEmpty = _matches.reduce((count, match) => (typeof match.str === 'undefined' || match.str === null || match.str === '') ? count - 1 : count, _matches.length)

  const ratio = (_matches.length > 0)
    ? html`<p class="sub-patterns__ratio">Matched ${notEmpty} / ${_matches.length} sub-patterns</p>`
    : ''

  const subPatterns = (_matches.length > 0)
    ? html`<ol class="sub-patterns__list">${_matches.map(renderSingleSub)}</ol>`
    : ''
  console.log('_matches:', _matches)
  console.log('_matches.length:', _matches.length)
  console.log('notEmpty:', notEmpty)
  console.groupEnd()

  return html`
    <div class="sub-patterns">
      <div class="sub-patterns__whole">${whole[0].str}</div>
      ${ratio}
      ${subPatterns}
    </div>
  `
}

const renderSingleRegexResult = (matches, regexes) => {
  // console.group('renderSingleRegexResult()')
  // console.log('matches:', matches)
  // console.log('regexes:', regexes)
  // console.log('regexes[' + matches.regexIndex + ']:', regexes[matches.regexIndex])
  // console.log('regexes[' + matches.regexIndex + '].regex:', regexes[matches.regexIndex].regex)
  // console.log('regexes[' + matches.regexIndex + '].flags:', regexes[matches.regexIndex].flags)
  // console.groupEnd()

  const regexStr = (typeof regexes[matches.regexIndex] !== 'undefined')
    ? '/' + regexes[matches.regexIndex].regex.pattern + '/' + regexes[matches.regexIndex].flags.flags
    : 'unkown'

  const captures = (matches.matches.length > 0)
    ? html`<ol class="match-captured__list">
      ${matches.matches.map(match => html`
        <li class="match-captured__items">
          ${renderCaptured(match)}
        </li>`
      )}
    </ol>`
    : ''
  const count = (matches.matches.length > 0)
    ? html`<div class="match-captured_count"><strong>Found:</strong> ${matches.matches.length} matches</div>`
    : ''

  return html`
    <div class="match-captured">
      <div class="match-code match-captured__regex">${regexStr}</div>
      ${count}
      ${captures}
    </div>
  `
}

const renderSingleSample = (matches, regexes) => {
  const sample = (matches.input.length > 300)
    ? matches.input.substr(0, 300)
    : matches.input

  const extraClass = (matches.input.length > 300)
    ? ' match-result__sample__str--long'
    : ''

  const results = (regexes.length > 1)
    ? html`<ol class="match-result__list">
      ${matches.matches.map(match => html`
        <li>${renderSingleRegexResult(match, regexes)}</li>`
      )}
    </ol>`
    : renderSingleRegexResult(matches.matches[0], regexes)

  return html`
    <div class="match-result__sample">
      <div class="match-code match-result__sample__str${extraClass}">${sample}</div>
      ${results}
    </div>
  `
}

export const oneOffMatchesView = (props, events) => {
  // console.group('oneOffMatchesView()')
  // console.log('prop:', props)

  // console.groupEnd()
  return (props.matches.length > 1)
    ? html`
        <ul class="match-sample__list">
          ${props.matches.map((matches) => html`
            <li class="match-sample__item">${renderSingleSample(matches, props.regexes)}</li>`)}
        </ul>`
    : renderSingleSample(props.matches[0], props.regexes)
}
