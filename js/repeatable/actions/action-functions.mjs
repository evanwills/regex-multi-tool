/* jslint browser: true */
/* global makeHumanReadableAttr */

// other global functions available:
//   invalidString, invalidStrNum, invalidNum, invalidArray, makeAttributeSafe, isFunction

import { multiLitRegexReplace } from '../repeatable-utils.mjs'
import { repeatable as doStuff } from '../repeatable-init.mjs'
/**
 * action-functions.js contains all the possible actions available to
 * "Do JS regex stuff"
 *
 * Each action has two parts:
 * 1. A function declaration which is the business part. This function
 *    gets called when the user clicks "Modify input"
 * 2. Passing a "Registration" object to doStuff.register() which
 *    provides all the configuration "Do JS regex stuff" needs to
 *    make the action work.
 *
 * __NOTE:__ If you are have created an action and want to keep it but
 * don't need it at the moment, add the property 'ignore' with a value
 * of TRUE to remove it from the list of actions.
 */

// ====================================================================
// START: Sample code

/**
 * exposeChickens() finds all the vowels in a string and converts them
 * to what a chicken might say if it could speak English.
 *
 * created by: Evan Wills
 * created: 2019-03-22
 *
 * @param {string} input user supplied content
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const exposeChickens = (input, extraInputs, GETvars) => {
  const _unsure = (extraInputs.mood('unsure')) ? ' I think' : ''
  const _angry = extraInputs.mood('angry')
  const _excited = extraInputs.mood('excited')
  // We retrieve the value of _gender by calling the function that
  // matches the ID (or name) of the input field
  const _gender = extraInputs.gender()
  const _year = extraInputs.year()

  let _boc = 'BOC! BOC!!'
  let _chicken = 'chicken'
  let output = ''
  let _spring = ''
  // We do the same for _year

  // Test the gender of the chicken
  if (_gender === 'male') {
    _chicken = 'rooster'
    _boc = 'COCK-A-DOODLE-DO'
  } else if (_gender === 'female') {
    _chicken = 'hen'
  } else if (_gender === 'other') {
    _chicken += ' first don\'t try to pigeon hole me'
  }

  // Test the Year (as defined by the user)
  if (_year >= 2018) {
    _spring = ' spring'
  } else if (_year < 2016) {
    _spring = 'n old'
    _chicken += '. Please don\'t boil me and make me into soup.'
  }

  if (_excited === true) {
    _boc += ' BOC-OCK!!! '
    output = ' [[' + _boc + _unsure + ' ' + _boc + _boc + 'I am a ' + _boc + _boc + _boc + _spring + ' ' + _boc + _boc + _boc + _boc + _chicken + ' ' + _boc + _boc + _boc + _boc + _boc + '!!]] '
  } else {
    output = ' [[' + _boc + '!!' + _unsure + ' I am a' + _spring + ' ' + _chicken + ']] '
  }

  if (_angry === true) {
    output = output.toUpperCase()
  }

  if (typeof GETvars.backwards === 'boolean' && GETvars.backwards === true) {
    output = output.split('').reverse().join('')
  }

  // Do the replacement and return the updated string
  return input.replace(/[aeiou]+/ig, output)
}

doStuff.register({
  action: 'doChicken',
  description: 'Change all vowels into chickens',
  // docURL: 'docs/expose-chickens.html',
  docURL: 'https://courses.acu.edu.au/do-js-regex-stuff/docs/expose-chickens',
  extraInputs: [
    {
      id: 'year',
      label: 'Year chicken was hatched',
      type: 'number',
      min: 2013,
      max: 2019,
      step: 1,
      default: 2019
    },
    {
      id: 'gender',
      label: 'Gender of chicken',
      type: 'radio',
      options: [
        { value: 'male', label: 'Male (rooster)' },
        { value: 'female', label: 'Female (hen)', default: true },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'mood',
      label: 'Mood of the chicken',
      type: 'checkbox',
      options: [
        { value: 'unsure', label: 'Chicken is confused about its identity' },
        { value: 'angry', label: 'Chicken woke up on the wrong side of its purch', default: true },
        { value: 'excited', label: 'Chicken is super excited', default: true }
      ]
    }
  ],
  func: exposeChickens,
  group: 'evan',
  ignore: false,
  name: 'Expose the chickens'
})

//  END:  Sample code
// ====================================================================
// START: heading to accordion

const makeAccordion = (input, extraInputs, GETvars) => {
  const heading = extraInputs.heading()
  const multi = extraInputs.multiCollpase('multi')
  const parent = extraInputs.parent()
  // var content = ''
  // var tmp = ''
  const regexHead = new RegExp('\\s*<h' + heading + '[^>]*>\\s*([\\s\\S]*?)\\s*</h' + heading + '>\\s*([\\s\\S]*?)\\s*(?=<h' + heading + '[^>]*>|$)', 'ig')
  let expand = true
  // var clean = new RegExp('(?:<div[^>]*>\\s*){2}<h2[^>]*>\\s*<a[^>]*>\\s*([\\s\\S]*?)\\s*<span[^>]*>[\\s\\S]*?</div>\\s*<div class="panel-body">\\s*([\\s\\S]*?)(?:\\s*</div>){3}', 'ig')
  const expandMode = extraInputs.expandMode()
  let defaultExpand = false

  if (expandMode === 'closeAll') {
    expand = false
    defaultExpand = false
  } else if (expandMode === 'openAll') {
    expand = true
    defaultExpand = true
  }

  /**
   * getExpanded() returns an object with the expanded attributes and
   * for both open button and panel body.
   *
   * @returns {object}
   */
  const getExpanded = () => {
    const __output = {
      expanded: '',
      in: ''
    }

    if (expand === true) {
      __output.expanded = ' aria-expanded="true"'
      __output.in = ' in'
      expand = defaultExpand
    }
    return __output
  }

  /**
   * wrapAccordion() wraps all the accordion items in the accordion
   * wrapper (with apporpriate attributes set)
   *
   * @param {string} input whole accordion block to be wrapped in HTML for a accordion (panel) group
   *
   * @returns {string} Full bootstrap compliant accordion
   */
  const wrapAccordion = (input) => {
    const _multi = (multi) ? ' aria-multiselectable="true"' : ''
    let __output = ''

    __output = '\n<div class="panel-group" id="' + parent + '" role="tablist"' + _multi + '>\n'
    __output += input
    __output += '</div>'

    return __output
  }

  /**
   * makeAccordFunc() returns a string of HTML code with appropriate
   * markup for bootstrap accordion blocks
   *
   * NOTE: this doesn't include makup for the 'panel-group' wrapper.
   *       the 'panel-group' wrapper must be applied after all the
   *       accordion blocks are generated.
   *
   * @param {string} match All the characters matched by the regular expression
   * @param {string} headingTxt Heading text for the accordion block
   * @param {string} accodionBody Body of the accordion block
   * @param {number} offset number where abouts in the whole string the match started
   * @param {string} whole the original string the match was found in
   *
   * @returns {string} marked up accordion block
   */
  const makeAccordFunc = (match, headingTxt, accordionBody, offset, whole) => {
    let __output = ''
    const _id = makeHumanReadableAttr(headingTxt)
    const _expanded = getExpanded()

    __output += '\t<div class="panel panel-default">\n'
    __output += '\t\t<div class="panel-heading" role="tab" id="head-' + _id + '">\t\n'
    __output += '\t\t\t<h' + heading + ' class="panel-title">\n'
    __output += '\t\t\t\t<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + _id + '" ' + _expanded.expanded + ' aria-controls="' + _id + '">\n'
    __output += '\t\t\t\t\t' + headingTxt + '\n'
    __output += '\t\t\t\t</a>\n'
    __output += '\t\t\t</h4>\n'
    __output += '\t\t</div>\n'
    __output += '\t\t<div id="' + _id + '" class="panel-collapse collapse ' + _expanded.in + '" role="tabpanel" aria-labelledby="head-' + _id + '">\n'
    __output += '\t\t\t<div class="panel-body">\n'
    __output += accordionBody
    __output += '\n\t\t\t</div>\n'
    __output += '\t\t</div>\n'
    __output += '\t</div>\n'

    return __output
  }

  /**
   * headingFunc() finds all the headings at a specific level and
   * wrap them and their following content in a bootstrap accordion
   * block
   *
   * @param {string} _input HTML markup for text with headings.
   *
   * @returns {string} marked up accordion block
   */
  const headingFunc = (_input) => {
    return wrapAccordion(_input.replace(regexHead, makeAccordFunc))
  }

  /**
   * dlFunc() finds all the "definition titles" and
   * "definition descriptions" a definiton list and wrap them in a
   * bootstrap accordion block
   *
   * @param {string} _input HTML markup for text with headings.
   *
   * @returns {string} marked up accordion block
   */
  const dlFunc = (_input) => {
    const __output = _input.replace(/<dl[^>]*>\\s*([\\s\\S]*?)\\s*<\/dl>/ig, '$1')
    return wrapAccordion(__output.replace(
      /\\s*<dt[^>]*>\\s*([\\s\\S]*?)\\s*<\/dt>\\s*<dd[^>]*>([\\s\\S]*?)\\s*<\/dd>/ig,
      makeAccordFunc
    ))
  }

  switch (extraInputs.mode()) {
    case 'headings':
      console.log('regexHead', regexHead)
      console.log('regexHead.test(input)', regexHead.test(input))
      return headingFunc(input)
      // return ''
      // break

    case 'dl':
      return dlFunc(input)
      // break

    case 'clean':
      return ''
      // break
  }
}

doStuff.register({
  action: 'heading2accordion',
  description: 'Convert content to an accordion using specific headings as the separator for the accordion',
  // docsURL: '',
  extraInputs: [
    {
      id: 'mode',
      label: 'Convert mode',
      options: [
        {
          value: 'headings',
          label: 'Use headings as block delimiters',
          default: true
        },
        {
          value: 'dl',
          label: 'Use definition list <DT>/<DD> as block delimiters'
        // },
        // {
        //   // not yet implemented
        //   value: 'clean',
        //   label: 'Make ID\'s (and anchors) based on headings'
        }
      ],
      type: 'radio'
    },
    {
      description: 'If "Convert mode" is "Use headings as block delimiters" content is matched based on the level of the heading specified here and also the heading level within the output HTML. If "Convert mode" is "Use definition list <DT>/<DD> as block delimiters" then this is only used to define the heading level within the output HTML.',
      id: 'heading',
      label: 'Heading level',
      options: [
        { value: 1, label: 'h1' },
        { value: 2, label: 'H2', default: true },
        { value: 3, label: 'H3' },
        { value: 4, label: 'H4' }
      ],
      type: 'select'
    },
    {
      default: 'accordion',
      id: 'parent',
      label: 'ID for accordion wrapper',
      pattern: '^[a-zA-Z_][a-zA-Z0-9_\\-]+$',
      type: 'text'
    },
    {
      id: 'multiCollpase',
      label: 'Multi Collapse',
      options: [
        {
          default: true,
          label: 'Allow multiple accordion blocks open at the same time.',
          value: 'multi'
        }
      ],
      type: 'checkbox'
    },
    {
      id: 'expandMode',
      label: 'Expand mode',
      options: [
        {
          default: true,
          label: 'No blocks open by default',
          value: 'closeAll'
        },
        {
          label: 'Open first block only',
          value: 'openFirst'
        },
        {
          label: 'Open ALL blocks by default',
          value: 'openAll'
        }
      ],
      type: 'radio'
    }
  ],
  func: makeAccordion,
  // ignore: true,
  name: 'Convert content to Bootstrap accordion blocks'
})

//  END:  heading to accordion
// ====================================================================
// START: Syntax highlighting for JS

function jsSyntaxHighlight (input, extraInputs, GETvars) {
  const findReplace = [
    { // 0 function name
      find: '([a-z0-9_]+(?:\\[(?:\'.*?\'|[a-z0-9_.])\\]|\\.[a-z0-9_]+)*)(?=\\s*\\()',
      replace: '<span class="fName">$1</span>'
    },
    { // 1 variable name
      find: '([a-z0-9_]+(?:\\[(?:\'.*?\'|[a-z0-9_.])\\]|\\.[a-z0-9_]+)*)(?=\\s*[,:=+)])',
      replace: '<span class="vName">$1</span>'
    },
    { // 2 token
      find: '(^|\\s)(function|var|return|if|else)(?=\\s)',
      replace: '$1<span class="tkn">$2</span>'
    },
    { // 3 comment
      find: '(\\s)(?:<em>)?//(.*?)(?:</em>)?(?=[\r\n])',
      replace: '$1<span class="comm">//<span class="commTxt">$2</span></span>'
    },
    { // 4 number
      find: '([0-9]+)',
      replace: '<span class="num">$1</span>'
    },
    { // 5 boolean
      find: '(true|false)',
      replace: '<span class="bool">$1</span>'
    },
    { // 6 string
      find: '(\\s|\\()(\'[^\']*\')(?=\\s|\\)|,)',
      replace: '$1<span class="str">$2</span>'
    },
    { // 7 brackets
      find: '([\\[\\]{}()]+)',
      replace: '<span class="bkt">$1</span>'
    },
    { // 8 fix
      find: '<span class="vName">(<span class="(?:num|bool|str)">.*?</span>|class)</span>',
      replace: '$1'
    }
  ]

  return multiLitRegexReplace(input, findReplace)
}

doStuff.register({
  action: 'jsSyntaxHighlight',
  func: jsSyntaxHighlight,
  ignore: false,
  name: 'Syntax highlighting for JS'
})

//  END:  Syntax highlighting for JS
// ====================================================================
// START: Fix heading levels when Migrating HTML from one system to another

/**
 * incrementH() finds all the headings in HTML code and increments or
 * decrements the level based on the option set in
 *  "Decrement/Increment heading importance"
 *
 * created by: Evan Wills
 * created: 2019-08-22
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function incrementH (input, extraInputs, GETvars) {
  const mode = Number.parseInt(extraInputs.mode())
  const replace = function (matches, close, level) {
    let h = '<'
    let newLevel = (Number.parseInt(level) + mode)

    // HTML only accepts headings between 1 & 6 (inclusive)
    // make sure the output level is between 1 & 6
    newLevel = (newLevel > 6) ? '6' : (newLevel < 1) ? 1 : newLevel
    h += (typeof (close) !== 'string' || close !== '/') ? '' : '/'
    h += 'h' + newLevel
    return h
  }
  return input.replace(/<(\/?)h([1-6])/ig, replace)
}

doStuff.register({
  action: 'incrementH',
  func: incrementH,
  ignore: false,
  name: 'Decrement or Increment HTML heading',
  description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
  extraInputs: [
    {
      id: 'mode',
      label: 'Decrement/Increment heading importance',
      options: [
        {
          value: '1',
          label: 'Reduce heading\'s importance',
          default: true
        },
        {
          value: '-1',
          label: 'Increase heading\'s importance'
        }
      ],
      type: 'radio'
    }
  ]
})

//  END:  Syntax highlighting for JS
// ==================================================================
// START: Match unfinished payment IDs to confirmed payments.

/**
 * matchPaymentIDs() tries to match payment IDs from unfinished
 * payments in form build with payment IDs supplied by Finance
 *
 * created by: Evan Wills
 * created: 2019-08-28
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function matchPaymentIDs (input, extraInputs, GETvars) {
  /**
   * splitPaymentID() takes a list of payment IDs as provided by
   * Finance and extracts the payment ID as listed in Form Build
   *
   * @param {string} str list of Finance payment IDs
   * @returns {array} list of payment IDs as seen in Form Build
   */
  function splitPaymentID (str) {
    let tmp = str.trim()
    tmp = tmp.replace(/^.*?_([0-9]+)\s*$/, '$1')
    return (isNaN(tmp)) ? '' : tmp
  }

  /**
   * splitNclean() splits a given string on new line characters
   *
   * @param {string} input string to be split
   * @returns {array} the input split by new line
   *          (each line has leading and trailing white space stripped)
   */
  function splitNclean (input) {
    const splitStr = input.split('\n')
    return splitStr.map(splitPaymentID).filter(str => str !== '')
  }

  /**
   * grep() builds a regular expression to find any lines starting
   * with the input string in the main input then returns the whole
   * line that string (or an empty string if nothing was matched)
   *
   * @param {string} str
   * @return {string}
   */
  function grep (str) {
    const found = input.match(/(?:^|[\r\n])(' + str + '\s+[^\r\n]+)(?=[\r\n]|$)/)
    return (found !== null) ? found[1] : ''
  }

  /**
   * implode() takes the contents of an array and implodes it with a
   * new line separator
   *
   * @param {string} accum accumulated value of the array
   * @param {string} str current item to be appended to the output
   * @returns {string}
   */
  function implode (accum, str) {
    const sep = (accum !== '') ? '\r\n' : ''
    return (str !== '') ? accum + sep + str : accum
  }

  const paymentIDs = splitNclean(extraInputs.paymentIDs())

  return paymentIDs.map(grep).filter(str => str !== '').reduce(implode, '')
}

doStuff.register({
  action: 'matchPaymentIDs',
  func: matchPaymentIDs,
  ignore: true,
  name: 'Match unfinished payment IDs to confirmed payments.',
  // docURL: 'https://courses.acu.edu.au/do-js-regex-stuff/docs/match_unfinished_payment_ids_to_confirmed_payments.',
  docURL: 'docs/match-unfinished-payment.html',
  inputLabel: 'Copied "Unfinished" payments listing',
  extraInputs: [
    {
      id: 'paymentIDs',
      label: 'Transaction Reference IDs (from finance)',
      type: 'textarea'
    }
  ]
})

//  END:  Match unfinished payment IDs to confirmed payments.
// ==================================================================
// START: URL decode/encode

/**
 * urlDecodeEncode() does a better job of URL encoding/decoding
 * special characters than built in JS function
 *
 * created by: Evan Wills
 * created: 2019-08-28
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function urlDecodeEncode (input, extraInputs, GETvars) {
  let find = 0
  let output = input
  let replace = 1
  const findReplace = [
    ['%25', '%', '%'], ['%09', '\t', '\\\t'], ['%0A', '\r', '\\\r'], ['%0D', '\n', '\\\n'],
    ['%20', ' ', ' '], ['%21', '!', '!'], ['%22', '"', '"'], ['%23', '#', '#'],
    ['%24', '$', '\\$'], ['%26', '&', '\\&'], ['%27', '\'', '\\\''], ['%28', '(', '\\('],
    ['%29', ')', '\\)'], ['%2A', '*', '\\*'], ['%2B', '+', '\\+'], ['%2C', ',', ','],
    ['%2D', '-', '-'], ['%2E', '.', '\\.'], ['%2F', '/', '\\/'],
    ['%3A', ':', ':'], ['%3B', ';', ';'], ['%3C', '<', '<'], ['%3D', '=', '='],
    ['%3E', '>', '>'], ['%3F', '?', '\\?'], ['%40', '@', '@'],
    ['%5B', '[', '\\['], ['%5C', '\\', '\\\\'], ['%5D', ']', '\\]'], ['%5E', '^', '\\^'],
    ['%60', '`', '`'],
    ['%7B', '{', '\\{'], ['%7C', '|', '\\|'], ['%7D', '}', '\\}'], ['%7E', '~', '~'],
    ['%A2', '¢', '¢'], ['%A3', '£', '£'], ['%A5', '¥', '¥'], ['%A6', '|', '\\|'],
    ['%A7', '§', '§'], ['%AB', '«', '«'], ['%AC', '¬', '¬'], ['%AD', '¯', '¯'],
    ['%B0', 'º', 'º'], ['%B1', '±', '±'], ['%B2', 'ª', 'ª'], ['%B4', ',', ','],
    ['%B5', 'µ', 'µ'], ['%BB', '»', '»'], ['%BC', '¼', '¼'], ['%BD', '½', '½'],
    ['%BF', '¿', '¿'],
    ['%C0', 'À', 'À'], ['%C1', 'Á', 'Á'], ['%C2', 'Â', 'Â'], ['%C3', 'Ã', 'Ã'],
    ['%C4', 'Ä', 'Ä'], ['%C5', 'Å', 'Å'], ['%C6', 'Æ', 'Æ'], ['%C7', 'Ç', 'Ç'],
    ['%C8', 'È', 'È'], ['%C9', 'É', 'É'], ['%CA', 'Ê', 'Ê'], ['%CB', 'Ë', 'Ë'],
    ['%CC', 'Ì', 'Ì'], ['%CD', 'Í', 'Í'], ['%CE', 'Î', 'Î'], ['%CF', 'Ï', 'Ï'],
    ['%D0', 'Ð', 'Ð'], ['%D1', 'Ñ', 'Ñ'], ['%D2', 'Ò', 'Ò'],
    ['%D3', 'Ó', 'Ó'], ['%D4', 'Ô', 'Ô'], ['%D5', 'Õ', 'Õ'], ['%D6', 'Ö', 'Ö'],
    ['%D8', 'Ø', 'Ø'],
    ['%D9', 'Ù', 'Ù'], ['%DA', 'Ú', 'Ú'], ['%DB', 'Û', 'Û'], ['%DC', 'Ü', 'Ü'],
    ['%DD', 'Ý', 'Ý'], ['%DE', 'Þ', 'Þ'], ['%DF', 'ß', 'ß'],
    ['%E0', 'à', 'à'], ['%E1', 'á', 'á'], ['%E2', 'â', 'â'], ['%E3', 'ã', 'ã'],
    ['%E4', 'ä', 'ä'], ['%E5', 'å', 'å'], ['%E6', 'æ', 'æ'], ['%E7', 'ç', 'ç'],
    ['%E8', 'è', 'è'], ['%E9', 'é', 'é'], ['%EA', 'ê', 'ê'], ['%EB', 'ë', 'ë'],
    ['%EC', 'ì', 'ì'], ['%ED', 'í', 'í'], ['%EE', 'î', 'î'], ['%EF', 'ï', 'ï'],
    ['%F0', 'ð', 'ð'], ['%F1', 'ñ', 'ñ'], ['%F2', 'ò', 'ò'], ['%F3', 'ó', 'ó'],
    ['%F4', 'ô', 'ô'], ['%F5', 'õ', 'õ'], ['%F6', 'ö', 'ö'],
    ['%F7', '÷', '÷'], ['%F8', 'ø', 'ø'],
    ['%F9', 'ù', 'ù'], ['%FA', 'ú', 'ú'], ['%FB', 'û', 'û'], ['%FC', 'ü', 'ü'],
    ['%FD', 'ý', 'ý'], ['%FE', 'þ', 'þ'], ['%FF', 'ÿ', 'ÿ']
  ]
  if (extraInputs.mode() === 'encode') {
    find = 2
    replace = 0
  }
  for (let a = 0; a < findReplace.length; a += 1) {
    output = output.replace(new RegExp(findReplace[a][find], 'g'), findReplace[a][replace])
  }
  return output
}

doStuff.register({
  action: 'urlDecodeEncode',
  description: 'Add or remove URI encoding from a URL',
  func: urlDecodeEncode,
  ignore: false,
  name: 'URI decode (or encode)',
  // docURL: 'https://courses.acu.edu.au/do-js-regex-stuff/docs/match_unfinished_payment_ids_to_confirmed_payments.',
  // docURL: 'docs/match-unfinished-payment.html',
  inputLabel: 'action',
  extraInputs: [
    {
      id: 'mode',
      label: 'Mode',
      type: 'radio',
      options: [
        {
          value: 'decode',
          label: 'Decode',
          default: true
        },
        {
          value: 'encode',
          label: 'Encode'
        }
      ]
    }
  ]
})

//  END:  Match unfinished payment IDs to confirmed payments.
// ====================================================================
// START: SVG ACU Logo cleanup

/**
 * acuLogoClean() remove all unnecessary junk from the ACU logo
 *
 * created by: Evan Wills
 * created: 2019-09-23
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function acuLogoClean (input, extraInputs, GETvars) {
  const regexes = [{
    find: /<g id="_Group_"[^>]+>/i,
    replace: '<g class="logo-txt">'
  }, {
    find: / class="cls-2"/i,
    replace: '---baahh---'
  }, {
    find: / class="cls-2"/ig,
    replace: ''
  }, {
    find: /---baahh---/i,
    replace: ' class="cls-2"'
  }, {
    find: / (?:id|data-name)="[^"]+"/ig,
    replace: ''
  }, {
    find: /<\/?g>/ig,
    replace: ''
  }, {
    find: /\s+/g,
    replace: ' '
  }, {
    find: /(?: (?=[<,{}@/.])|([>,{};/.]) )/g,
    replace: '$1'
  }, {
    find: ' id="acu-logo"',
    replace: ''
  }, {
    find: '</svg>',
    replace: '</g></svg>'
  }, {
    find: 'Artboard 1',
    replace: 'Australian Catholic University (ACU)'
  }, {
    find: /(<style xmlns="http:\/\/www\.w3\.org\/2000\/svg">).*?(?=<\/style>)/i,
    replace: '$1.cls-1{fill:#ed0c00;}.cls-2,.logo-txt{fill:#fff;}@media print{.logo-txt,.cls-1{fill:#3c1053;}}'
  }, {
    find: /<g class="logo-txt">/ig,
    replace: '---blah---'
  }, {
    find: '---blah---',
    replace: '<g class="logo-txt">'
  }, {
    find: '---blah---',
    replace: ''
  }]

  return multiLitRegexReplace(input, regexes)
}

doStuff.register({
  action: 'acuLogoClean',
  func: acuLogoClean,
  group: 'mer',
  ignore: true,
  name: 'Minify ACU Logo SVG'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

//  END:  Syntax highlighting for JS
// ====================================================================
// START: Staff Access Card URL

function staffAccessCard (input, extraInputs, GETvars) {
  const baseURL = 'https://forms.acu.edu.au/public/staff_access_card'
  const altURL = 'https://forms.acu.edu.au/public/staff_access_card_validation_test'
  const raw = window.btoa('?email=' + extraInputs.email() + '&gender=' + extraInputs.gender())
  let data = ''

  for (let a = (raw.length - 1); a >= 0; a -= 1) {
    data += raw[a]
  }

  return baseURL + '?data=' + window.btoa(data) + '\n\n\n' + altURL + '?data=' + window.btoa(data)
}

doStuff.register({
  action: 'staffAccessCard',
  func: staffAccessCard,
  description: 'Generate a staff access card URL with email and gender bound in',
  // docsURL: '',
  extraInputs: [
    {
      id: 'email',
      label: 'Email address',
      type: 'email'
    },
    {
      id: 'gender',
      label: 'Gender',
      options: [
        {
          label: 'Male',
          value: 'm'
        },
        {
          label: 'Female',
          value: 'f'
        }
      ],
      type: 'radio'
    }
  ],
  ignore: true,
  name: 'Staff Access Card URL'
})

//  END:  Staff Access Card URL
// ====================================================================
// START: Fix CEG unit modal URLs

/**
 * fixCEGunitURLs() Fix CEG unit modal URLs
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function fixCEGunitURLs (input, extraInputs, GETvars) {
  let output = input
  const regex = [
    {
      find: /https:\/\/(?:enrolment-guides|handbook)\.acu\.edu\.au\/(?:handbooks\/handbook_)?[0-9]{4}\/unit_display(?=\?unit=)/ig,
      replace: './?a=2318995'
    },
    {
      find: /&nbsp;/ig,
      replace: ' '
    },
    {
      find: /&amp;(?=SQ_DESIGN_NAME=modal)/ig,
      replace: '&'
    }
  ]

  for (let a = 0; a < regex.length; a += 1) {
    output = output.replace(regex[a].find, regex[a].replace)
  }

  return output
}

doStuff.register({
  action: 'fixCEGunitURLs',
  func: fixCEGunitURLs,
  description: 'Fix CEG unit modal URLs',
  // docsURL: '',
  extraInputs: [],
  ignore: true,
  name: 'Fix CEG unit URLs'
})

//  END:  Fix CEG unit modal URLs
// ====================================================================
// START: fixPoliciesAnchorLinks

/**
 * Make sure invalid anchors and ToC are converted to valid links and
 * anchors
 *
 * created by: Evan Wills
 * created: 2020-08-04
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function fixPoliciesAnchorLinksV1 (input, extraInputs, GETvars) {
  let output = input
  const labelsAndIDs = []

  /**
   * Make a sure string only contains alpha-numeric characters,
   * hyphens & underscores
   *
   * @param {string} subID string to be used as the Sub-ID for a link
   *
   * @returns {string}
   */
  const makeIdSafeSub = (subID) => {
    if (typeof subID === 'undefined') {
      return ''
    }

    subID = subID.replace(/^[^a-z0-9]+|[^a-z0-9]+$/ig, '')

    return subID.replace(/[^a-z0-9_\\-]+/ig, '-')
  }

  /**
   * Make ID safe as HTML ID
   *
   * @param {string} id           ID string to be cleaned
   * @param {number} headingLevel
   *
   * @returns {string}
   */
  const makeIdSafe = (id, subID) => {
    let output = id.trim()

    output = output.replace(/[^a-z0-9]+/ig, '-')
    output = 'a' + makeIdSafeSub(subID) + '__' + output.toLowerCase()

    return output
  }

  /**
   * Find all the headings in a policy and create new IDs for them
   *
   * @param {string} whole   Whole matched pattern
   * @param {string} level   Heading level
   * @param {string} id      ID for heading
   * @param {string} num     Hierarchical number of heading
   * @param {string} heading Heading text
   *
   * @returns {string}
   */
  const updateHeadings = (whole, level, id, num, heading) => {
    const _id = makeIdSafe(heading, id)

    if (labelsAndIDs.indexOf(_id) === -1) {
      labelsAndIDs.push(_id)
    }

    return '<a id="' + _id + '" name="' + _id + '" class="sticky-safe-anchor">&nbsp;</a><h' + level + '>' + num + heading
  }

  /**
   * Update the links in the Table of Contents
   *
   * @param {string} whole      Whole matched pattern
   * @param {string} attribute1 First attribute name
   * @param {string} hash1      First attribute hash character
   * @param {string} value1     First attribute value
   * @param {string} attribute2 Second attribute name
   * @param {string} hash2      Second attribute hash character
   * @param {string} value2     Second attribute value
   * @param {string} linkText   Link text
   *
   * @returns {string}
   */
  const updateLinks = (whole, attribute1, hash1, value1, attribute2, hash2, value2, linkText) => {
    if (hash1 === '#' || hash2 === '#') {
      if (value1 !== 'top' && value2 !== 'top') {
        const subID = (hash1 === '#') ? value1 : value2
        // console.log('tmpID:', tmpID)
        const _id = makeIdSafe(linkText, subID)

        if (labelsAndIDs.indexOf(_id) >= 0) {
          return '<a href="#' + _id + '">' + linkText
        }
      }
    }
    return whole
  }

  output = output.replace(
    /'<h([1-5])(?: id="([^"]+)")>((?:[0-9]+\.?)+\s*)(.*?)\s*(?=<\/h\1>)/ig,
    updateHeadings
  )
  output = output.replace(
    /<a(?:\s+(title|href)="(#?)([^"]+)")(?:\s+(title|href)="(#?)([^"]+)")?>([^<]+)(?=<\/a>)/ig,
    updateLinks
  )

  return output
}

doStuff.register({
  action: 'fixPoliciesAnchorLinksV1',
  func: fixPoliciesAnchorLinksV1,
  description: '',
  // docsURL: '',
  extraInputs: [],
  ignore: true,
  name: 'Fix policy anchor links'
})

//  END: fixPoliciesAnchorLinksV1
// ====================================================================
// START: Strip inline styles from table elements

/**
 *
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function stripTableStyles (input, extraInputs, GETvars) {
  const tableInner = (whole) => {
    console.log('whole:', whole)
    return whole.replace(/\sstyle="[^"]+"/igs, '')
  }

  if (extraInputs.whichStyle() === 'table') {
    return input.replace(/<(?:table|t(?:[hdr]|head|body|foot))[^>]+>/igs, tableInner)
  } else {
    return tableInner(input)
  }
}

doStuff.register({
  action: 'stripTableStyles',
  func: stripTableStyles,
  description: 'Remove style attributes (inline styles) from HTML',
  // docsURL: '',
  extraInputs: [
    {
      id: 'whichStyle',
      label: 'Which style blocks to delete',
      type: 'radio',
      options: [
        { value: 'table', label: 'Only table (and related elements)' },
        { value: 'all', label: 'All style attributes', default: true }
        // { value: 'other', label: 'Other' }
      ]
    }],
  ignore: false,
  name: 'Strip inline table styles'
})

//  END:  Strip inline styles from table elements
// ====================================================================
// START: Base64

function base64 (input, extraInputs, GETvars) {
  if (extraInputs.mode() === 'true') {
    console.log('Base64 encoding')
    return window.btoa(input)
  } else {
    console.log('Base64 decoding')
    return window.atob(input)
  }
}

doStuff.register({
  action: 'Base64',
  description: 'Encode/Decode Base64 string',
  func: base64,
  // group: 'it',
  // ignore: true,
  name: 'Base64 encode/decode',
  extraInputs: [
    {
      id: 'mode',
      label: 'Encode/Decode mode',
      options: [
        {
          value: 'true',
          label: 'Encode',
          default: true
        },
        {
          value: 'false',
          label: 'Decode'
        }
      ],
      type: 'radio'
    }
  ]
})

//  END:  Base64
// ====================================================================
// START: Comma separated thousands

/**
 * Put comma before each thousand
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const commaSepThousand = (input, extraInputs, GETvars) => {
  const revStr = (str) => {
    const _str = str.split('')
    const _rst = _str.reverse()
    return _rst.join('')
  }

  const commaSep = (whole, pre, num) => {
    const _mun = revStr(num)
    const _hasComma = _mun.replace(/([0-9]{3})(?=[0-9])/g, '$1,')
    return pre + revStr(_hasComma)
  }

  return input.replace(/(^|[^0-9.])([0-9]+)(?=\.[0-9]+\s*)?/ig, commaSep)
}

doStuff.register({
  action: 'commaSepThousand',
  func: commaSepThousand,
  description: '',
  // docsURL: '',
  extraInputs: [],
  // group: '',
  ignore: false,
  name: 'Comma separated thousands'
})

//  END: Comma separated thousands
// ====================================================================
// START: Format handbook policy

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const formatHandbookPolicy = (input, extraInputs, GETvars) => {
  let currentHeading = 0
  let depth = 0
  let openSections = 0
  let closeSections = 0
  let output = input
  const knownIDs = []

  /**
   * Convert heading text to a human readable ID attribute
   *
   * @param {string} input
   *
   * @returns {string} HTML 4.0 safe full id attribute string
   */
  function makeID (_input) {
    let _output = _input.trim()
    let tmp = ''
    let a = 0

    // clean up heading text to make it ID safe (and human readable)
    _output = _output.toLowerCase()
    _output = _output.replace(/[^a-z0-9_-]+/g, '-') // strip undesirable chars
    _output = _output.replace(/-+_+-+/g, '_') // strip bad join combos
    _output = _output.replace(/_+-+_+/g, '-') // strip bad join combos

    // Handle duplicate IDs
    tmp = _output
    while (knownIDs.indexOf(tmp) > -1) {
      tmp = _output + '__' + a // possible unique ID
      a += 1
    }

    // Make sure we have a unique ID
    _output = (tmp !== _output) ? tmp : _output

    // Add the unique ID to the list of all IDs on the page
    knownIDs.push(_output)

    // send a complete ID attribute back
    return ' id="' + _output + '"'
  }

  /**
   * Prefix SECTION tags to H tags
   *
   * @param {string} whole
   * @param {string} hNum
   * @param {string} headingText
   *
   * @returns {string}
   */
  const wrapSection =(whole, hNum, headingText) => {
    let id = makeID(headingText)
    let sectionTags = ''

    if (hNum > currentHeading) {
      // Deeper level heading
      hNum = currentHeading
      openSections = hNum - currentHeading // In a well structured document this will always be 1
      depth += openSections

      for (let a = 0; a < depth; a += 1) {
        sectionTags = '<section' + id + '>' + sectionTags
        id = ''
      }
    } else if (hNum < currentHeading) {
      // Shallower level heading
      hNum = currentHeading
      closeSections = currentHeading - hNum // In a well structured document this will always be 1
      depth -= closeSections

      for (let a = 0; a < depth; a += 1) {
        sectionTags += '</section>'
      }
      sectionTags += '<section' + id + '>'
    } else {
      // Same level heading
      sectionTags = '</section><section' + id + '>'
    }
    return sectionTags + whole
  }

  function listClasses (whole, close, tag, attrs) {
    const isOpen = close !== '/'
    const listClasses = {
      1: 'list-alpha',
      2: 'list-roman',
      3: 'list-decimal',
      4: 'list-alpha',
      5: 'list-roman',
      6: 'list-decimal',
      7: 'list-alpha',
      8: 'list-roman',
      9: 'list-decimal'
    }

    console.group('listClasses()')
    console.log('whole:', whole)
    console.log('close:', close)
    console.log('tag:', tag)
    console.log('attrs:', attrs)

    if (tag === 'li') {
      // strip styles from list items.
      console.log('List item')
      console.groupEnd()
      return '<' + close + tag + attrs.replace(/\s+style="[^"]*"/ig, '') + '>'
    } else {
      console.log('Ordered list')
      console.log('depth:', depth)
      console.log('isOpen:', isOpen)
      depth = (isOpen) ? depth + 1 : depth - 1
      console.log('depth:', depth)
    }
    console.log('typeof listClasses[' + depth + ']:', typeof listClasses[depth])

    if (isOpen && typeof listClasses[depth] === 'string') {
      console.groupEnd()
      return '<' + close + tag + ' class="' + listClasses[depth] + '"' + attrs.replace(/\s+(?:class|style|type)="[^"]*"/ig, '') + '>'
    } else {
      console.groupEnd()
      return whole
    }
  }

  // if (extraInputs.mods('sections') === true) {
  //   output = output.replace(/<h([1-6])[^>]*>(.*?)<\/h$1>/ig, wrapSection)
  // }

  if (extraInputs.mods('lists') === true) {
    output = output.replace(/<(\/?)(ol|li)([^>]*)>/ig, listClasses)
  }

  if (extraInputs.mods('outerWrap') === true && !output.match('policy-document--ph')) {
    output = '<div class="policy-document policy-document--ph">\n\n' + output + '\n\n</div>'
  }

  return output
}

doStuff.register({
  action: 'formatHandbookPolicy',
  func: formatHandbookPolicy,
  description: '',
  // docsURL: '',
  extraInputs: [
    {
      id: 'mods',
      label: 'Modification options',
      type: 'checkbox',
      options: [
        { value: 'lists', label: 'Set classes on OL tags', default: true },
        { value: 'outerWrap', label: 'Wrap the whole content in policy document class', default: true }
        // { value: 'sections', label: 'Wrap headings in sections' }
      ]
    }],
  // group: 'cim',
  ignore: false,
  name: 'Format handbook policy'
})

//  END: Format handbook policy
// ====================================================================
// START: HTML Enchode special chars

/**
 * HTML Enchode special chars
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const htmlSpecialChars = (input, extraInputs, GETvars) => {
  const findReplace = [
    [/\u0160/g, '&nbsp;'], // NO-BREAK SPACE
    [/\u0161/g, '&iexcl;'], // INVERTED EXCLAMATION MARK
    [/\u0162/g, '&cent;'], // CENT SIGN
    [/\u0163/g, '&pound;'], // POUND SIGN
    [/\u0164/g, '&curren;'], // CURRENCY SIGN
    [/\u0165/g, '&yen;'], // YEN SIGN
    [/\u0166/g, '&brvbar;'], // BROKEN BAR
    [/\u0167/g, '&sect;'], // SECTION SIGN
    [/\u0168/g, '&Dot;'], // DIAERESIS
    [/\u0169/g, '&copy;'], // COPYRIGHT SIGN
    [/\u0170/g, '&ordf;'], // FEMININE ORDINAL INDICATOR
    [/\u0171/g, '&laquo;'], // LEFT-POINTING DOUBLE ANGLE QUOTATION MARK
    [/\u0172/g, '&not;'], // NOT SIGN
    [/\u0173/g, '&shy;'], // SOFT HYPHEN
    [/\u0174/g, '&reg;'], // REGISTERED SIGN
    [/\u0175/g, '&macr;'], // MACRON
    [/\u0176/g, '&deg;'], // DEGREE SIGN
    [/\u0177/g, '&plusmn;'], // PLUS-MINUS SIGN
    [/\u0178/g, '&sup2;'], // SUPERSCRIPT TWO
    [/\u0179/g, '&sup3;'], // SUPERSCRIPT THREE
    [/\u0180/g, '&acute;'], // ACUTE ACCENT
    [/\u0181/g, '&micro;'], // MICRO SIGN
    [/\u0182/g, '&para;'], // PILCROW SIGN
    [/\u0183/g, '&middot;'], // MIDDLE DOT
    [/\u0184/g, '&cedil;'], // CEDILLA
    [/\u0185/g, '&sup1;'], // SUPERSCRIPT ONE
    [/\u0186/g, '&ordm;'], // MASCULINE ORDINAL INDICATOR
    [/\u0187/g, '&raquo;'], // RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK
    [/\u0188/g, '&frac14;'], // VULGAR FRACTION ONE QUARTER
    [/\u0189/g, '&frac12;'], // VULGAR FRACTION ONE HALF
    [/\u0190/g, '&frac34;'], // VULGAR FRACTION THREE QUARTERS
    [/\u0191/g, '&iquest;'], // INVERTED QUESTION MARK
    [/\u0192/g, '&Agrave;'], // LATIN CAPITAL LETTER A WITH GRAVE
    [/\u0193/g, '&Aacute;'], // LATIN CAPITAL LETTER A WITH ACUTE
    [/\u0194/g, '&Acirc;'], // LATIN CAPITAL LETTER A WITH CIRCUMFLEX
    [/\u0195/g, '&Atilde;'], // LATIN CAPITAL LETTER A WITH TILDE
    [/\u0196/g, '&Auml;'], // LATIN CAPITAL LETTER A WITH DIAERESIS
    [/\u0197/g, '&Aring;'], // LATIN CAPITAL LETTER A WITH RING ABOVE
    [/\u0198/g, '&AElig;'], // LATIN CAPITAL LETTER AE
    [/\u0199/g, '&Ccedil;'], // LATIN CAPITAL LETTER C WITH CEDILLA
    [/\u0200/g, '&Egrave;'], // LATIN CAPITAL LETTER E WITH GRAVE
    [/\u0201/g, '&Eacute;'], // LATIN CAPITAL LETTER E WITH ACUTE
    [/\u0202/g, '&Ecirc;'], // LATIN CAPITAL LETTER E WITH CIRCUMFLEX
    [/\u0203/g, '&Euml;'], // LATIN CAPITAL LETTER E WITH DIAERESIS
    [/\u0204/g, '&Igrave;'], // LATIN CAPITAL LETTER I WITH GRAVE
    [/\u0205/g, '&Iacute;'], // LATIN CAPITAL LETTER I WITH ACUTE
    [/\u0206/g, '&Icirc;'], // LATIN CAPITAL LETTER I WITH CIRCUMFLEX
    [/\u0207/g, '&Iuml;'], // LATIN CAPITAL LETTER I WITH DIAERESIS
    [/\u0208/g, '&ETH;'], // LATIN CAPITAL LETTER ETH
    [/\u0209/g, '&Ntilde;'], // LATIN CAPITAL LETTER N WITH TILDE
    [/\u0210/g, '&Ograve;'], // LATIN CAPITAL LETTER O WITH GRAVE
    [/\u0211/g, '&Oacute;'], // LATIN CAPITAL LETTER O WITH ACUTE
    [/\u0212/g, '&Ocirc;'], // LATIN CAPITAL LETTER O WITH CIRCUMFLEX
    [/\u0213/g, '&Otilde;'], // LATIN CAPITAL LETTER O WITH TILDE
    [/\u0214/g, '&Ouml;'], // LATIN CAPITAL LETTER O WITH DIAERESIS
    [/\u0215/g, '&times;'], // MULTIPLICATION SIGN
    [/\u0216/g, '&Oslash;'], // LATIN CAPITAL LETTER O WITH STROKE
    [/\u0217/g, '&Ugrave;'], // LATIN CAPITAL LETTER U WITH GRAVE
    [/\u0218/g, '&Uacute;'], // LATIN CAPITAL LETTER U WITH ACUTE
    [/\u0219/g, '&Ucirc;'], // LATIN CAPITAL LETTER U WITH CIRCUMFLEX
    [/\u0220/g, '&Uuml;'], // LATIN CAPITAL LETTER U WITH DIAERESIS
    [/\u0221/g, '&Yacute;'], // LATIN CAPITAL LETTER Y WITH ACUTE
    [/\u0222/g, '&THORN;'], // LATIN CAPITAL LETTER THORN
    [/\u0223/g, '&szlig;'], // LATIN SMALL LETTER SHARP S
    [/\u0224/g, '&agrave;'], // LATIN SMALL LETTER A WITH GRAVE
    [/\u0225/g, '&aacute;'], // LATIN SMALL LETTER A WITH ACUTE
    [/\u0226/g, '&acirc;'], // LATIN SMALL LETTER A WITH CIRCUMFLEX
    [/\u0227/g, '&atilde;'], // LATIN SMALL LETTER A WITH TILDE
    [/\u0228/g, '&auml;'], // LATIN SMALL LETTER A WITH DIAERESIS
    [/\u0229/g, '&aring;'], // LATIN SMALL LETTER A WITH RING ABOVE
    [/\u0230/g, '&aelig;'], // LATIN SMALL LETTER AE
    [/\u0231/g, '&ccedil;'], // LATIN SMALL LETTER C WITH CEDILLA
    [/\u0232/g, '&egrave;'], // LATIN SMALL LETTER E WITH GRAVE
    [/\u0233/g, '&eacute;'], // LATIN SMALL LETTER E WITH ACUTE
    [/\u0234/g, '&ecirc;'], // LATIN SMALL LETTER E WITH CIRCUMFLEX
    [/\u0235/g, '&euml;'], // LATIN SMALL LETTER E WITH DIAERESIS
    [/\u0236/g, '&igrave;'], // LATIN SMALL LETTER I WITH GRAVE
    [/\u0237/g, '&iacute;'], // LATIN SMALL LETTER I WITH ACUTE
    [/\u0238/g, '&icirc;'], // LATIN SMALL LETTER I WITH CIRCUMFLEX
    [/\u0239/g, '&iuml;'], // LATIN SMALL LETTER I WITH DIAERESIS
    [/\u0240/g, '&eth;'], // LATIN SMALL LETTER ETH
    [/\u0241/g, '&ntilde;'], // LATIN SMALL LETTER N WITH TILDE
    [/\u0242/g, '&ograve;'], // LATIN SMALL LETTER O WITH GRAVE
    [/\u0243/g, '&oacute;'], // LATIN SMALL LETTER O WITH ACUTE
    [/\u0244/g, '&ocirc;'], // LATIN SMALL LETTER O WITH CIRCUMFLEX
    [/\u0245/g, '&otilde;'], // LATIN SMALL LETTER O WITH TILDE
    [/\u0246/g, '&ouml;'], // LATIN SMALL LETTER O WITH DIAERESIS
    [/\u0247/g, '&divide;'], // DIVISION SIGN
    [/\u0248/g, '&oslash;'], // LATIN SMALL LETTER O WITH STROKE
    [/\u0249/g, '&ugrave;'], // LATIN SMALL LETTER U WITH GRAVE
    [/\u0250/g, '&uacute;'], // LATIN SMALL LETTER U WITH ACUTE
    [/\u0251/g, '&ucirc;'], // LATIN SMALL LETTER U WITH CIRCUMFLEX
    [/\u0252/g, '&uuml;'], // LATIN SMALL LETTER U WITH DIAERESIS
    [/\u0253/g, '&yacute;'], // LATIN SMALL LETTER Y WITH ACUTE
    [/\u0254/g, '&thorn;'], // LATIN SMALL LETTER THORN
    [/\u0255/g, '&yuml;'], // LATIN SMALL LETTER Y WITH DIAERESIS
    [/\u0256/g, '&Amacr;'], // LATIN CAPITAL LETTER A WITH MACRON
    [/\u0257/g, '&amacr;'], // LATIN SMALL LETTER A WITH MACRON
    [/\u0258/g, '&Abreve;'], // LATIN CAPITAL LETTER A WITH BREVE
    [/\u0259/g, '&abreve;'], // LATIN SMALL LETTER A WITH BREVE
    [/\u0260/g, '&Aogon;'], // LATIN CAPITAL LETTER A WITH OGONEK
    [/\u0261/g, '&aogon;'], // LATIN SMALL LETTER A WITH OGONEK
    [/\u0262/g, '&Cacute;'], // LATIN CAPITAL LETTER C WITH ACUTE
    [/\u0263/g, '&cacute;'], // LATIN SMALL LETTER C WITH ACUTE
    [/\u0264/g, '&Ccirc;'], // LATIN CAPITAL LETTER C WITH CIRCUMFLEX
    [/\u0265/g, '&ccirc;'], // LATIN SMALL LETTER C WITH CIRCUMFLEX
    [/\u0266/g, '&Cdot;'], // LATIN CAPITAL LETTER C WITH DOT ABOVE
    [/\u0267/g, '&cdot;'], // LATIN SMALL LETTER C WITH DOT ABOVE
    [/\u0268/g, '&Ccaron;'], // LATIN CAPITAL LETTER C WITH CARON
    [/\u0269/g, '&ccaron;'], // LATIN SMALL LETTER C WITH CARON
    [/\u0270/g, '&Dcaron;'], // LATIN CAPITAL LETTER D WITH CARON
    [/\u0271/g, '&dcaron;'], // LATIN SMALL LETTER D WITH CARON
    [/\u0272/g, '&Dstrok;'], // LATIN CAPITAL LETTER D WITH STROKE
    [/\u0273/g, '&dstrok;'], // LATIN SMALL LETTER D WITH STROKE
    [/\u0274/g, '&Emacr;'], // LATIN CAPITAL LETTER E WITH MACRON
    [/\u0275/g, '&emacr;'], // LATIN SMALL LETTER E WITH MACRON
    [/\u0278/g, '&Edot;'], // LATIN CAPITAL LETTER E WITH DOT ABOVE
    [/\u0279/g, '&edot;'], // LATIN SMALL LETTER E WITH DOT ABOVE
    [/\u0280/g, '&Eogon;'], // LATIN CAPITAL LETTER E WITH OGONEK
    [/\u0281/g, '&eogon;'], // LATIN SMALL LETTER E WITH OGONEK
    [/\u0282/g, '&Ecaron;'], // LATIN CAPITAL LETTER E WITH CARON
    [/\u0283/g, '&ecaron;'], // LATIN SMALL LETTER E WITH CARON
    [/\u0284/g, '&Gcirc;'], // LATIN CAPITAL LETTER G WITH CIRCUMFLEX
    [/\u0285/g, '&gcirc;'], // LATIN SMALL LETTER G WITH CIRCUMFLEX
    [/\u0286/g, '&Gbreve;'], // LATIN CAPITAL LETTER G WITH BREVE
    [/\u0287/g, '&gbreve;'], // LATIN SMALL LETTER G WITH BREVE
    [/\u0288/g, '&Gdot;'], // LATIN CAPITAL LETTER G WITH DOT ABOVE
    [/\u0289/g, '&gdot;'], // LATIN SMALL LETTER G WITH DOT ABOVE
    [/\u0290/g, '&Gcedil;'], // LATIN CAPITAL LETTER G WITH CEDILLA
    [/\u0292/g, '&Hcirc;'], // LATIN CAPITAL LETTER H WITH CIRCUMFLEX
    [/\u0293/g, '&hcirc;'], // LATIN SMALL LETTER H WITH CIRCUMFLEX
    [/\u0294/g, '&Hstrok;'], // LATIN CAPITAL LETTER H WITH STROKE
    [/\u0295/g, '&hstrok;'], // LATIN SMALL LETTER H WITH STROKE
    [/\u0296/g, '&Itilde;'], // LATIN CAPITAL LETTER I WITH TILDE
    [/\u0297/g, '&itilde;'], // LATIN SMALL LETTER I WITH TILDE
    [/\u0298/g, '&Imacr;'], // LATIN CAPITAL LETTER I WITH MACRON
    [/\u0299/g, '&imacr;'], // LATIN SMALL LETTER I WITH MACRON
    [/\u0302/g, '&Iogon;'], // LATIN CAPITAL LETTER I WITH OGONEK
    [/\u0303/g, '&iogon;'], // LATIN SMALL LETTER I WITH OGONEK
    [/\u0304/g, '&Idot;'], // LATIN CAPITAL LETTER I WITH DOT ABOVE
    [/\u0305/g, '&imath;'], // LATIN SMALL LETTER DOTLESS I
    [/\u0306/g, '&IJlig;'], // LATIN CAPITAL LIGATURE IJ
    [/\u0307/g, '&ijlig;'], // LATIN SMALL LIGATURE IJ
    [/\u0308/g, '&Jcirc;'], // LATIN CAPITAL LETTER J WITH CIRCUMFLEX
    [/\u0309/g, '&jcirc;'], // LATIN SMALL LETTER J WITH CIRCUMFLEX
    [/\u0310/g, '&Kcedil;'], // LATIN CAPITAL LETTER K WITH CEDILLA
    [/\u0311/g, '&kcedil;'], // LATIN SMALL LETTER K WITH CEDILLA
    [/\u0312/g, '&kgreen;'], // LATIN SMALL LETTER KRA
    [/\u0313/g, '&Lacute;'], // LATIN CAPITAL LETTER L WITH ACUTE
    [/\u0314/g, '&lacute;'], // LATIN SMALL LETTER L WITH ACUTE
    [/\u0315/g, '&Lcedil;'], // LATIN CAPITAL LETTER L WITH CEDILLA
    [/\u0316/g, '&lcedil;'], // LATIN SMALL LETTER L WITH CEDILLA
    [/\u0317/g, '&Lcaron;'], // LATIN CAPITAL LETTER L WITH CARON
    [/\u0318/g, '&lcaron;'], // LATIN SMALL LETTER L WITH CARON
    [/\u0319/g, '&Lmidot;'], // LATIN CAPITAL LETTER L WITH MIDDLE DOT
    [/\u0320/g, '&lmidot;'], // LATIN SMALL LETTER L WITH MIDDLE DOT
    [/\u0321/g, '&Lstrok;'], // LATIN CAPITAL LETTER L WITH STROKE
    [/\u0322/g, '&lstrok;'], // LATIN SMALL LETTER L WITH STROKE
    [/\u0323/g, '&Nacute;'], // LATIN CAPITAL LETTER N WITH ACUTE
    [/\u0324/g, '&nacute;'], // LATIN SMALL LETTER N WITH ACUTE
    [/\u0325/g, '&Ncedil;'], // LATIN CAPITAL LETTER N WITH CEDILLA
    [/\u0326/g, '&ncedil;'], // LATIN SMALL LETTER N WITH CEDILLA
    [/\u0327/g, '&Ncaron;'], // LATIN CAPITAL LETTER N WITH CARON
    [/\u0328/g, '&ncaron;'], // LATIN SMALL LETTER N WITH CARON
    [/\u0329/g, '&napos;'], // LATIN SMALL LETTER N PRECEDED BY APOSTROPHE
    [/\u0330/g, '&ENG;'], // LATIN CAPITAL LETTER ENG
    [/\u0331/g, '&eng;'], // LATIN SMALL LETTER ENG
    [/\u0332/g, '&Omacr;'], // LATIN CAPITAL LETTER O WITH MACRON
    [/\u0333/g, '&omacr;'], // LATIN SMALL LETTER O WITH MACRON
    [/\u0336/g, '&Odblac;'], // LATIN CAPITAL LETTER O WITH DOUBLE ACUTE
    [/\u0337/g, '&odblac;'], // LATIN SMALL LETTER O WITH DOUBLE ACUTE
    [/\u0338/g, '&OElig;'], // LATIN CAPITAL LIGATURE OE
    [/\u0339/g, '&oelig;'], // LATIN SMALL LIGATURE OE
    [/\u0340/g, '&Racute;'], // LATIN CAPITAL LETTER R WITH ACUTE
    [/\u0341/g, '&racute;'], // LATIN SMALL LETTER R WITH ACUTE
    [/\u0342/g, '&Rcedil;'], // LATIN CAPITAL LETTER R WITH CEDILLA
    [/\u0343/g, '&rcedil;'], // LATIN SMALL LETTER R WITH CEDILLA
    [/\u0344/g, '&Rcaron;'], // LATIN CAPITAL LETTER R WITH CARON
    [/\u0345/g, '&rcaron;'], // LATIN SMALL LETTER R WITH CARON
    [/\u0346/g, '&Sacute;'], // LATIN CAPITAL LETTER S WITH ACUTE
    [/\u0347/g, '&sacute;'], // LATIN SMALL LETTER S WITH ACUTE
    [/\u0348/g, '&Scirc;'], // LATIN CAPITAL LETTER S WITH CIRCUMFLEX
    [/\u0349/g, '&scirc;'], // LATIN SMALL LETTER S WITH CIRCUMFLEX
    [/\u0350/g, '&Scedil;'], // LATIN CAPITAL LETTER S WITH CEDILLA
    [/\u0351/g, '&scedil;'], // LATIN SMALL LETTER S WITH CEDILLA
    [/\u0352/g, '&Scaron;'], // LATIN CAPITAL LETTER S WITH CARON
    [/\u0353/g, '&scaron;'], // LATIN SMALL LETTER S WITH CARON
    [/\u0354/g, '&Tcedil;'], // LATIN CAPITAL LETTER T WITH CEDILLA
    [/\u0355/g, '&tcedil;'], // LATIN SMALL LETTER T WITH CEDILLA
    [/\u0356/g, '&Tcaron;'], // LATIN CAPITAL LETTER T WITH CARON
    [/\u0357/g, '&tcaron;'], // LATIN SMALL LETTER T WITH CARON
    [/\u0358/g, '&Tstrok;'], // LATIN CAPITAL LETTER T WITH STROKE
    [/\u0359/g, '&tstrok;'], // LATIN SMALL LETTER T WITH STROKE
    [/\u0360/g, '&Utilde;'], // LATIN CAPITAL LETTER U WITH TILDE
    [/\u0361/g, '&utilde;'], // LATIN SMALL LETTER U WITH TILDE
    [/\u0362/g, '&Umacr;'], // LATIN CAPITAL LETTER U WITH MACRON
    [/\u0363/g, '&umacr;'], // LATIN SMALL LETTER U WITH MACRON
    [/\u0364/g, '&Ubreve;'], // LATIN CAPITAL LETTER U WITH BREVE
    [/\u0365/g, '&ubreve;'], // LATIN SMALL LETTER U WITH BREVE
    [/\u0366/g, '&Uring;'], // LATIN CAPITAL LETTER U WITH RING ABOVE
    [/\u0367/g, '&uring;'], // LATIN SMALL LETTER U WITH RING ABOVE
    [/\u0368/g, '&Udblac;'], // LATIN CAPITAL LETTER U WITH DOUBLE ACUTE
    [/\u0369/g, '&udblac;'], // LATIN SMALL LETTER U WITH DOUBLE ACUTE
    [/\u0370/g, '&Uogon;'], // LATIN CAPITAL LETTER U WITH OGONEK
    [/\u0371/g, '&uogon;'], // LATIN SMALL LETTER U WITH OGONEK
    [/\u0372/g, '&Wcirc;'], // LATIN CAPITAL LETTER W WITH CIRCUMFLEX
    [/\u0373/g, '&wcirc;'], // LATIN SMALL LETTER W WITH CIRCUMFLEX
    [/\u0374/g, '&Ycirc;'], // LATIN CAPITAL LETTER Y WITH CIRCUMFLEX
    [/\u0375/g, '&ycirc;'], // LATIN SMALL LETTER Y WITH CIRCUMFLEX
    [/\u0376/g, '&Yuml;'], // LATIN CAPITAL LETTER Y WITH DIAERESIS
    [/\u0377/g, '&Zacute;'], // LATIN CAPITAL LETTER Z WITH ACUTE
    [/\u0378/g, '&zacute;'], // LATIN SMALL LETTER Z WITH ACUTE
    [/\u0379/g, '&Zdot;'], // LATIN CAPITAL LETTER Z WITH DOT ABOVE
    [/\u0380/g, '&zdot;'], // LATIN SMALL LETTER Z WITH DOT ABOVE
    [/\u0381/g, '&Zcaron;'], // LATIN CAPITAL LETTER Z WITH CARON
    [/\u0382/g, '&zcaron;'], // LATIN SMALL LETTER Z WITH CARON
    [/\u0402/g, '&fnof;'], // LATIN SMALL LETTER F WITH HOOK
    [/\u0437/g, '&imped;'], // LATIN CAPITAL LETTER Z WITH STROKE
    [/\u0501/g, '&gacute;'], // LATIN SMALL LETTER G WITH ACUTE
    [/\u0567/g, '&jmath;'], // LATIN SMALL LETTER DOTLESS J
    [/\u0710/g, '&circ;'], // MODIFIER LETTER CIRCUMFLEX ACCENT
    [/\u0711/g, '&caron;'], // CARON
    [/\u0728/g, '&breve;'], // BREVE
    [/\u0729/g, '&dot;'], // DOT ABOVE
    [/\u0730/g, '&ring;'], // RING ABOVE
    [/\u0731/g, '&ogon;'], // OGONEK
    [/\u0732/g, '&tilde;'], // SMALL TILDE
    [/\u0733/g, '&dblac;'], // DOUBLE ACUTE ACCENT
    [/\u0785/g, '&DownBreve;'], // COMBINING INVERTED BREVE
    [/\u0818/g, '&UnderBar;'], // COMBINING LOW LINE
    [/\u0913/g, '&Alpha;'], // GREEK CAPITAL LETTER ALPHA
    [/\u0914/g, '&Beta;'], // GREEK CAPITAL LETTER BETA
    [/\u0915/g, '&Gamma;'], // GREEK CAPITAL LETTER GAMMA
    [/\u0916/g, '&Delta;'], // GREEK CAPITAL LETTER DELTA
    [/\u0917/g, '&Epsilon;'], // GREEK CAPITAL LETTER EPSILON
    [/\u0918/g, '&Zeta;'], // GREEK CAPITAL LETTER ZETA
    [/\u0919/g, '&Eta;'], // GREEK CAPITAL LETTER ETA
    [/\u0920/g, '&Theta;'], // GREEK CAPITAL LETTER THETA
    [/\u0921/g, '&Iota;'], // GREEK CAPITAL LETTER IOTA
    [/\u0922/g, '&Kappa;'], // GREEK CAPITAL LETTER KAPPA
    [/\u0923/g, '&Lambda;'], // GREEK CAPITAL LETTER LAMDA
    [/\u0924/g, '&Mu;'], // GREEK CAPITAL LETTER MU
    [/\u0925/g, '&Nu;'], // GREEK CAPITAL LETTER NU
    [/\u0926/g, '&Xi;'], // GREEK CAPITAL LETTER XI
    [/\u0927/g, '&Omicron;'], // GREEK CAPITAL LETTER OMICRON
    [/\u0928/g, '&Pi;'], // GREEK CAPITAL LETTER PI
    [/\u0929/g, '&Rho;'], // GREEK CAPITAL LETTER RHO
    [/\u0931/g, '&Sigma;'], // GREEK CAPITAL LETTER SIGMA
    [/\u0932/g, '&Tau;'], // GREEK CAPITAL LETTER TAU
    [/\u0933/g, '&Upsilon;'], // GREEK CAPITAL LETTER UPSILON
    [/\u0934/g, '&Phi;'], // GREEK CAPITAL LETTER PHI
    [/\u0935/g, '&Chi;'], // GREEK CAPITAL LETTER CHI
    [/\u0936/g, '&Psi;'], // GREEK CAPITAL LETTER PSI
    [/\u0937/g, '&Omega;'], // GREEK CAPITAL LETTER OMEGA
    [/\u0945/g, '&alpha;'], // GREEK SMALL LETTER ALPHA
    [/\u0946/g, '&beta;'], // GREEK SMALL LETTER BETA
    [/\u0947/g, '&gamma;'], // GREEK SMALL LETTER GAMMA
    [/\u0948/g, '&delta;'], // GREEK SMALL LETTER DELTA
    [/\u0949/g, '&epsiv;'], // GREEK SMALL LETTER EPSILON
    [/\u0950/g, '&zeta;'], // GREEK SMALL LETTER ZETA
    [/\u0951/g, '&eta;'], // GREEK SMALL LETTER ETA
    [/\u0952/g, '&theta;'], // GREEK SMALL LETTER THETA
    [/\u0953/g, '&iota;'], // GREEK SMALL LETTER IOTA
    [/\u0954/g, '&kappa;'], // GREEK SMALL LETTER KAPPA
    [/\u0955/g, '&lambda;'], // GREEK SMALL LETTER LAMDA
    [/\u0956/g, '&mu;'], // GREEK SMALL LETTER MU
    [/\u0957/g, '&nu;'], // GREEK SMALL LETTER NU
    [/\u0958/g, '&xi;'], // GREEK SMALL LETTER XI
    [/\u0959/g, '&omicron;'], // GREEK SMALL LETTER OMICRON
    [/\u0960/g, '&pi;'], // GREEK SMALL LETTER PI
    [/\u0961/g, '&rho;'], // GREEK SMALL LETTER RHO
    [/\u0962/g, '&sigmav;'], // GREEK SMALL LETTER FINAL SIGMA
    [/\u0963/g, '&sigma;'], // GREEK SMALL LETTER SIGMA
    [/\u0964/g, '&tau;'], // GREEK SMALL LETTER TAU
    [/\u0965/g, '&upsi;'], // GREEK SMALL LETTER UPSILON
    [/\u0966/g, '&phi;'], // GREEK SMALL LETTER PHI
    [/\u0967/g, '&chi;'], // GREEK SMALL LETTER CHI
    [/\u0968/g, '&psi;'], // GREEK SMALL LETTER PSI
    [/\u0969/g, '&omega;'], // GREEK SMALL LETTER OMEGA
    [/\u0977/g, '&thetav;'], // GREEK THETA SYMBOL
    [/\u0978/g, '&Upsi;'], // GREEK UPSILON WITH HOOK SYMBOL
    [/\u0981/g, '&straightphi;'], // GREEK PHI SYMBOL
    [/\u0982/g, '&piv;'], // GREEK PI SYMBOL
    [/\u0988/g, '&Gammad;'], // GREEK LETTER DIGAMMA
    [/\u0989/g, '&gammad;'], // GREEK SMALL LETTER DIGAMMA
    [/\u1008/g, '&kappav;'], // GREEK KAPPA SYMBOL
    [/\u1009/g, '&rhov;'], // GREEK RHO SYMBOL
    [/\u1013/g, '&epsi;'], // GREEK LUNATE EPSILON SYMBOL
    [/\u1014/g, '&bepsi;'], // GREEK REVERSED LUNATE EPSILON SYMBOL
    [/\u1025/g, '&IOcy;'], // CYRILLIC CAPITAL LETTER IO
    [/\u1026/g, '&DJcy;'], // CYRILLIC CAPITAL LETTER DJE
    [/\u1027/g, '&GJcy;'], // CYRILLIC CAPITAL LETTER GJE
    [/\u1028/g, '&Jukcy;'], // CYRILLIC CAPITAL LETTER UKRAINIAN IE
    [/\u1029/g, '&DScy;'], // CYRILLIC CAPITAL LETTER DZE
    [/\u1030/g, '&Iukcy;'], // CYRILLIC CAPITAL LETTER BYELORUSSIAN-UKRAINIAN I
    [/\u1031/g, '&YIcy;'], // CYRILLIC CAPITAL LETTER YI
    [/\u1032/g, '&Jsercy;'], // CYRILLIC CAPITAL LETTER JE
    [/\u1033/g, '&LJcy;'], // CYRILLIC CAPITAL LETTER LJE
    [/\u1034/g, '&NJcy;'], // CYRILLIC CAPITAL LETTER NJE
    [/\u1035/g, '&TSHcy;'], // CYRILLIC CAPITAL LETTER TSHE
    [/\u1036/g, '&KJcy;'], // CYRILLIC CAPITAL LETTER KJE
    [/\u1038/g, '&Ubrcy;'], // CYRILLIC CAPITAL LETTER SHORT U
    [/\u1039/g, '&DZcy;'], // CYRILLIC CAPITAL LETTER DZHE
    [/\u1040/g, '&Acy;'], // CYRILLIC CAPITAL LETTER A
    [/\u1041/g, '&Bcy;'], // CYRILLIC CAPITAL LETTER BE
    [/\u1042/g, '&Vcy;'], // CYRILLIC CAPITAL LETTER VE
    [/\u1043/g, '&Gcy;'], // CYRILLIC CAPITAL LETTER GHE
    [/\u1044/g, '&Dcy;'], // CYRILLIC CAPITAL LETTER DE
    [/\u1045/g, '&IEcy;'], // CYRILLIC CAPITAL LETTER IE
    [/\u1046/g, '&ZHcy;'], // CYRILLIC CAPITAL LETTER ZHE
    [/\u1047/g, '&Zcy;'], // CYRILLIC CAPITAL LETTER ZE
    [/\u1048/g, '&Icy;'], // CYRILLIC CAPITAL LETTER I
    [/\u1049/g, '&Jcy;'], // CYRILLIC CAPITAL LETTER SHORT I
    [/\u1050/g, '&Kcy;'], // CYRILLIC CAPITAL LETTER KA
    [/\u1051/g, '&Lcy;'], // CYRILLIC CAPITAL LETTER EL
    [/\u1052/g, '&Mcy;'], // CYRILLIC CAPITAL LETTER EM
    [/\u1053/g, '&Ncy;'], // CYRILLIC CAPITAL LETTER EN
    [/\u1054/g, '&Ocy;'], // CYRILLIC CAPITAL LETTER O
    [/\u1055/g, '&Pcy;'], // CYRILLIC CAPITAL LETTER PE
    [/\u1056/g, '&Rcy;'], // CYRILLIC CAPITAL LETTER ER
    [/\u1057/g, '&Scy;'], // CYRILLIC CAPITAL LETTER ES
    [/\u1058/g, '&Tcy;'], // CYRILLIC CAPITAL LETTER TE
    [/\u1059/g, '&Ucy;'], // CYRILLIC CAPITAL LETTER U
    [/\u1060/g, '&Fcy;'], // CYRILLIC CAPITAL LETTER EF
    [/\u1061/g, '&KHcy;'], // CYRILLIC CAPITAL LETTER HA
    [/\u1062/g, '&TScy;'], // CYRILLIC CAPITAL LETTER TSE
    [/\u1063/g, '&CHcy;'], // CYRILLIC CAPITAL LETTER CHE
    [/\u1064/g, '&SHcy;'], // CYRILLIC CAPITAL LETTER SHA
    [/\u1065/g, '&SHCHcy;'], // CYRILLIC CAPITAL LETTER SHCHA
    [/\u1066/g, '&HARDcy;'], // CYRILLIC CAPITAL LETTER HARD SIGN
    [/\u1067/g, '&Ycy;'], // CYRILLIC CAPITAL LETTER YERU
    [/\u1068/g, '&SOFTcy;'], // CYRILLIC CAPITAL LETTER SOFT SIGN
    [/\u1069/g, '&Ecy;'], // CYRILLIC CAPITAL LETTER E
    [/\u1070/g, '&YUcy;'], // CYRILLIC CAPITAL LETTER YU
    [/\u1071/g, '&YAcy;'], // CYRILLIC CAPITAL LETTER YA
    [/\u1072/g, '&acy;'], // CYRILLIC SMALL LETTER A
    [/\u1073/g, '&bcy;'], // CYRILLIC SMALL LETTER BE
    [/\u1074/g, '&vcy;'], // CYRILLIC SMALL LETTER VE
    [/\u1075/g, '&gcy;'], // CYRILLIC SMALL LETTER GHE
    [/\u1076/g, '&dcy;'], // CYRILLIC SMALL LETTER DE
    [/\u1077/g, '&iecy;'], // CYRILLIC SMALL LETTER IE
    [/\u1078/g, '&zhcy;'], // CYRILLIC SMALL LETTER ZHE
    [/\u1079/g, '&zcy;'], // CYRILLIC SMALL LETTER ZE
    [/\u1080/g, '&icy;'], // CYRILLIC SMALL LETTER I
    [/\u1081/g, '&jcy;'], // CYRILLIC SMALL LETTER SHORT I
    [/\u1082/g, '&kcy;'], // CYRILLIC SMALL LETTER KA
    [/\u1083/g, '&lcy;'], // CYRILLIC SMALL LETTER EL
    [/\u1084/g, '&mcy;'], // CYRILLIC SMALL LETTER EM
    [/\u1085/g, '&ncy;'], // CYRILLIC SMALL LETTER EN
    [/\u1086/g, '&ocy;'], // CYRILLIC SMALL LETTER O
    [/\u1087/g, '&pcy;'], // CYRILLIC SMALL LETTER PE
    [/\u1088/g, '&rcy;'], // CYRILLIC SMALL LETTER ER
    [/\u1089/g, '&scy;'], // CYRILLIC SMALL LETTER ES
    [/\u1090/g, '&tcy;'], // CYRILLIC SMALL LETTER TE
    [/\u1091/g, '&ucy;'], // CYRILLIC SMALL LETTER U
    [/\u1092/g, '&fcy;'], // CYRILLIC SMALL LETTER EF
    [/\u1093/g, '&khcy;'], // CYRILLIC SMALL LETTER HA
    [/\u1094/g, '&tscy;'], // CYRILLIC SMALL LETTER TSE
    [/\u1095/g, '&chcy;'], // CYRILLIC SMALL LETTER CHE
    [/\u1096/g, '&shcy;'], // CYRILLIC SMALL LETTER SHA
    [/\u1097/g, '&shchcy;'], // CYRILLIC SMALL LETTER SHCHA
    [/\u1098/g, '&hardcy;'], // CYRILLIC SMALL LETTER HARD SIGN
    [/\u1099/g, '&ycy;'], // CYRILLIC SMALL LETTER YERU
    [/\u1100/g, '&softcy;'], // CYRILLIC SMALL LETTER SOFT SIGN
    [/\u1101/g, '&ecy;'], // CYRILLIC SMALL LETTER E
    [/\u1102/g, '&yucy;'], // CYRILLIC SMALL LETTER YU
    [/\u1103/g, '&yacy;'], // CYRILLIC SMALL LETTER YA
    [/\u1105/g, '&iocy;'], // CYRILLIC SMALL LETTER IO
    [/\u1106/g, '&djcy;'], // CYRILLIC SMALL LETTER DJE
    [/\u1107/g, '&gjcy;'], // CYRILLIC SMALL LETTER GJE
    [/\u1108/g, '&jukcy;'], // CYRILLIC SMALL LETTER UKRAINIAN IE
    [/\u1109/g, '&dscy;'], // CYRILLIC SMALL LETTER DZE
    [/\u1110/g, '&iukcy;'], // CYRILLIC SMALL LETTER BYELORUSSIAN-UKRAINIAN I
    [/\u1111/g, '&yicy;'], // CYRILLIC SMALL LETTER YI
    [/\u1112/g, '&jsercy;'], // CYRILLIC SMALL LETTER JE
    [/\u1113/g, '&ljcy;'], // CYRILLIC SMALL LETTER LJE
    [/\u1114/g, '&njcy;'], // CYRILLIC SMALL LETTER NJE
    [/\u1115/g, '&tshcy;'], // CYRILLIC SMALL LETTER TSHE
    [/\u1116/g, '&kjcy;'], // CYRILLIC SMALL LETTER KJE
    [/\u1118/g, '&ubrcy;'], // CYRILLIC SMALL LETTER SHORT U
    [/\u1119/g, '&dzcy;'], // CYRILLIC SMALL LETTER DZHE
    [/\u8194/g, '&ensp;'], // EN SPACE
    [/\u8195/g, '&emsp;'], // EM SPACE
    [/\u8196/g, '&emsp13;'], // THREE-PER-EM SPACE
    [/\u8197/g, '&emsp14;'], // FOUR-PER-EM SPACE
    [/\u8199/g, '&numsp;'], // FIGURE SPACE
    [/\u8200/g, '&puncsp;'], // PUNCTUATION SPACE
    [/\u8201/g, '&thinsp;'], // THIN SPACE
    [/\u8202/g, '&hairsp;'], // HAIR SPACE
    [/\u8203/g, '&ZeroWidthSpace;'], // ZERO WIDTH SPACE
    [/\u8204/g, '&zwnj;'], // ZERO WIDTH NON-JOINER
    [/\u8205/g, '&zwj;'], // ZERO WIDTH JOINER
    [/\u8206/g, '&lrm;'], // LEFT-TO-RIGHT MARK
    [/\u8207/g, '&rlm;'], // RIGHT-TO-LEFT MARK
    [/\u8208/g, '&hyphen;'], // HYPHEN
    [/\u8211/g, '&ndash;'], // EN DASH
    [/\u8212/g, '&mdash;'], // EM DASH
    [/\u8213/g, '&horbar;'], // HORIZONTAL BAR
    [/\u8214/g, '&Verbar;'], // DOUBLE VERTICAL LINE
    [/\u8216/g, '&lsquo;'], // LEFT SINGLE QUOTATION MARK
    [/\u8217/g, '&rsquo;'], // RIGHT SINGLE QUOTATION MARK
    [/\u8218/g, '&lsquor;'], // SINGLE LOW-9 QUOTATION MARK
    [/\u8220/g, '&ldquo;'], // LEFT DOUBLE QUOTATION MARK
    [/\u8221/g, '&rdquo;'], // RIGHT DOUBLE QUOTATION MARK
    [/\u8222/g, '&ldquor;'], // DOUBLE LOW-9 QUOTATION MARK
    [/\u8224/g, '&dagger;'], // DAGGER
    [/\u8225/g, '&Dagger;'], // DOUBLE DAGGER
    [/\u8226/g, '&bull;'], // BULLET
    [/\u8229/g, '&nldr;'], // TWO DOT LEADER
    [/\u8230/g, '&hellip;'], // HORIZONTAL ELLIPSIS
    [/\u8240/g, '&permil;'], // PER MILLE SIGN
    [/\u8241/g, '&pertenk;'], // PER TEN THOUSAND SIGN
    [/\u8242/g, '&prime;'], // PRIME
    [/\u8243/g, '&Prime;'], // DOUBLE PRIME
    [/\u8244/g, '&tprime;'], // TRIPLE PRIME
    [/\u8245/g, '&bprime;'], // REVERSED PRIME
    [/\u8249/g, '&lsaquo;'], // SINGLE LEFT-POINTING ANGLE QUOTATION MARK
    [/\u8250/g, '&rsaquo;'], // SINGLE RIGHT-POINTING ANGLE QUOTATION MARK
    [/\u8254/g, '&oline;'], // OVERLINE
    [/\u8257/g, '&caret;'], // CARET INSERTION POINT
    [/\u8259/g, '&hybull;'], // HYPHEN BULLET
    [/\u8260/g, '&frasl;'], // FRACTION SLASH
    [/\u8271/g, '&bsemi;'], // REVERSED SEMICOLON
    [/\u8279/g, '&qprime;'], // QUADRUPLE PRIME
    [/\u8287/g, '&MediumSpace;'], // MEDIUM MATHEMATICAL SPACE
    [/\u8288/g, '&NoBreak;'], // WORD JOINER
    [/\u8289/g, '&ApplyFunction;'], // FUNCTION APPLICATION
    [/\u8290/g, '&InvisibleTimes;'], // INVISIBLE TIMES
    [/\u8291/g, '&InvisibleComma;'], // INVISIBLE SEPARATOR
    [/\u8364/g, '&euro;'], // EURO SIGN
    [/\u8411/g, '&tdot;'], // COMBINING THREE DOTS ABOVE
    [/\u8412/g, '&DotDot;'], // COMBINING FOUR DOTS ABOVE
    [/\u8450/g, '&Copf;'], // DOUBLE-STRUCK CAPITAL C
    [/\u8453/g, '&incare;'], // CARE OF
    [/\u8458/g, '&gscr;'], // SCRIPT SMALL G
    [/\u8459/g, '&hamilt;'], // SCRIPT CAPITAL H
    [/\u8460/g, '&Hfr;'], // BLACK-LETTER CAPITAL H
    [/\u8461/g, '&quaternions;'], // DOUBLE-STRUCK CAPITAL H
    [/\u8462/g, '&planckh;'], // PLANCK CONSTANT
    [/\u8463/g, '&planck;'], // PLANCK CONSTANT OVER TWO PI
    [/\u8464/g, '&Iscr;'], // SCRIPT CAPITAL I
    [/\u8465/g, '&image;'], // BLACK-LETTER CAPITAL I
    [/\u8466/g, '&Lscr;'], // SCRIPT CAPITAL L
    [/\u8467/g, '&ell;'], // SCRIPT SMALL L
    [/\u8469/g, '&Nopf;'], // DOUBLE-STRUCK CAPITAL N
    [/\u8470/g, '&numero;'], // NUMERO SIGN
    [/\u8471/g, '&copysr;'], // SOUND RECORDING COPYRIGHT
    [/\u8472/g, '&weierp;'], // SCRIPT CAPITAL P
    [/\u8473/g, '&Popf;'], // DOUBLE-STRUCK CAPITAL P
    [/\u8474/g, '&rationals;'], // DOUBLE-STRUCK CAPITAL Q
    [/\u8475/g, '&Rscr;'], // SCRIPT CAPITAL R
    [/\u8476/g, '&real;'], // BLACK-LETTER CAPITAL R
    [/\u8477/g, '&reals;'], // DOUBLE-STRUCK CAPITAL R
    [/\u8478/g, '&rx;'], // PRESCRIPTION TAKE
    [/\u8482/g, '&trade;'], // TRADE MARK SIGN
    [/\u8484/g, '&integers;'], // DOUBLE-STRUCK CAPITAL Z
    [/\u8486/g, '&ohm;'], // OHM SIGN
    [/\u8487/g, '&mho;'], // INVERTED OHM SIGN
    [/\u8488/g, '&Zfr;'], // BLACK-LETTER CAPITAL Z
    [/\u8489/g, '&iiota;'], // TURNED GREEK SMALL LETTER IOTA
    [/\u8491/g, '&angst;'], // ANGSTROM SIGN
    [/\u8492/g, '&bernou;'], // SCRIPT CAPITAL B
    [/\u8493/g, '&Cfr;'], // BLACK-LETTER CAPITAL C
    [/\u8495/g, '&escr;'], // SCRIPT SMALL E
    [/\u8496/g, '&Escr;'], // SCRIPT CAPITAL E
    [/\u8497/g, '&Fscr;'], // SCRIPT CAPITAL F
    [/\u8499/g, '&phmmat;'], // SCRIPT CAPITAL M
    [/\u8500/g, '&order;'], // SCRIPT SMALL O
    [/\u8501/g, '&alefsym;'], // ALEF SYMBOL
    [/\u8502/g, '&beth;'], // BET SYMBOL
    [/\u8503/g, '&gimel;'], // GIMEL SYMBOL
    [/\u8504/g, '&daleth;'], // DALET SYMBOL
    [/\u8517/g, '&CapitalDifferentialD;'], // DOUBLE-STRUCK ITALIC CAPITAL D
    [/\u8518/g, '&DifferentialD;'], // DOUBLE-STRUCK ITALIC SMALL D
    [/\u8519/g, '&ExponentialE;'], // DOUBLE-STRUCK ITALIC SMALL E
    [/\u8520/g, '&ImaginaryI;'], // DOUBLE-STRUCK ITALIC SMALL I
    [/\u8531/g, '&frac13;'], // VULGAR FRACTION ONE THIRD
    [/\u8532/g, '&frac23;'], // VULGAR FRACTION TWO THIRDS
    [/\u8533/g, '&frac15;'], // VULGAR FRACTION ONE FIFTH
    [/\u8534/g, '&frac25;'], // VULGAR FRACTION TWO FIFTHS
    [/\u8535/g, '&frac35;'], // VULGAR FRACTION THREE FIFTHS
    [/\u8536/g, '&frac45;'], // VULGAR FRACTION FOUR FIFTHS
    [/\u8537/g, '&frac16;'], // VULGAR FRACTION ONE SIXTH
    [/\u8538/g, '&frac56;'], // VULGAR FRACTION FIVE SIXTHS
    [/\u8539/g, '&frac18;'], // VULGAR FRACTION ONE EIGHTH
    [/\u8540/g, '&frac38;'], // VULGAR FRACTION THREE EIGHTHS
    [/\u8541/g, '&frac58;'], // VULGAR FRACTION FIVE EIGHTHS
    [/\u8542/g, '&frac78;'], // VULGAR FRACTION SEVEN EIGHTHS
    [/\u8592/g, '&larr;'], // LEFTWARDS ARROW
    [/\u8593/g, '&uarr;'], // UPWARDS ARROW
    [/\u8594/g, '&rarr;'], // RIGHTWARDS ARROW
    [/\u8595/g, '&darr;'], // DOWNWARDS ARROW
    [/\u8596/g, '&harr;'], // LEFT RIGHT ARROW
    [/\u8597/g, '&varr;'], // UP DOWN ARROW
    [/\u8598/g, '&nwarr;'], // NORTH WEST ARROW
    [/\u8599/g, '&nearr;'], // NORTH EAST ARROW
    [/\u8600/g, '&searr;'], // SOUTH EAST ARROW
    [/\u8601/g, '&swarr;'], // SOUTH WEST ARROW
    [/\u8602/g, '&nlarr;'], // LEFTWARDS ARROW WITH STROKE
    [/\u8603/g, '&nrarr;'], // RIGHTWARDS ARROW WITH STROKE
    [/\u8605/g, '&rarrw;'], // RIGHTWARDS WAVE ARROW
    [/\u8606/g, '&Larr;'], // LEFTWARDS TWO HEADED ARROW
    [/\u8607/g, '&Uarr;'], // UPWARDS TWO HEADED ARROW
    [/\u8608/g, '&Rarr;'], // RIGHTWARDS TWO HEADED ARROW
    [/\u8609/g, '&Darr;'], // DOWNWARDS TWO HEADED ARROW
    [/\u8610/g, '&larrtl;'], // LEFTWARDS ARROW WITH TAIL
    [/\u8611/g, '&rarrtl;'], // RIGHTWARDS ARROW WITH TAIL
    [/\u8612/g, '&LeftTeeArrow;'], // LEFTWARDS ARROW FROM BAR
    [/\u8613/g, '&UpTeeArrow;'], // UPWARDS ARROW FROM BAR
    [/\u8614/g, '&map;'], // RIGHTWARDS ARROW FROM BAR
    [/\u8615/g, '&DownTeeArrow;'], // DOWNWARDS ARROW FROM BAR
    [/\u8617/g, '&larrhk;'], // LEFTWARDS ARROW WITH HOOK
    [/\u8618/g, '&rarrhk;'], // RIGHTWARDS ARROW WITH HOOK
    [/\u8619/g, '&larrlp;'], // LEFTWARDS ARROW WITH LOOP
    [/\u8620/g, '&rarrlp;'], // RIGHTWARDS ARROW WITH LOOP
    [/\u8621/g, '&harrw;'], // LEFT RIGHT WAVE ARROW
    [/\u8622/g, '&nharr;'], // LEFT RIGHT ARROW WITH STROKE
    [/\u8624/g, '&lsh;'], // UPWARDS ARROW WITH TIP LEFTWARDS
    [/\u8625/g, '&rsh;'], // UPWARDS ARROW WITH TIP RIGHTWARDS
    [/\u8626/g, '&ldsh;'], // DOWNWARDS ARROW WITH TIP LEFTWARDS
    [/\u8627/g, '&rdsh;'], // DOWNWARDS ARROW WITH TIP RIGHTWARDS
    [/\u8629/g, '&crarr;'], // DOWNWARDS ARROW WITH CORNER LEFTWARDS
    [/\u8630/g, '&cularr;'], // ANTICLOCKWISE TOP SEMICIRCLE ARROW
    [/\u8631/g, '&curarr;'], // CLOCKWISE TOP SEMICIRCLE ARROW
    [/\u8634/g, '&olarr;'], // ANTICLOCKWISE OPEN CIRCLE ARROW
    [/\u8635/g, '&orarr;'], // CLOCKWISE OPEN CIRCLE ARROW
    [/\u8636/g, '&lharu;'], // LEFTWARDS HARPOON WITH BARB UPWARDS
    [/\u8637/g, '&lhard;'], // LEFTWARDS HARPOON WITH BARB DOWNWARDS
    [/\u8638/g, '&uharr;'], // UPWARDS HARPOON WITH BARB RIGHTWARDS
    [/\u8639/g, '&uharl;'], // UPWARDS HARPOON WITH BARB LEFTWARDS
    [/\u8640/g, '&rharu;'], // RIGHTWARDS HARPOON WITH BARB UPWARDS
    [/\u8641/g, '&rhard;'], // RIGHTWARDS HARPOON WITH BARB DOWNWARDS
    [/\u8642/g, '&dharr;'], // DOWNWARDS HARPOON WITH BARB RIGHTWARDS
    [/\u8643/g, '&dharl;'], // DOWNWARDS HARPOON WITH BARB LEFTWARDS
    [/\u8644/g, '&rlarr;'], // RIGHTWARDS ARROW OVER LEFTWARDS ARROW
    [/\u8645/g, '&udarr;'], // UPWARDS ARROW LEFTWARDS OF DOWNWARDS ARROW
    [/\u8646/g, '&lrarr;'], // LEFTWARDS ARROW OVER RIGHTWARDS ARROW
    [/\u8647/g, '&llarr;'], // LEFTWARDS PAIRED ARROWS
    [/\u8648/g, '&uuarr;'], // UPWARDS PAIRED ARROWS
    [/\u8649/g, '&rrarr;'], // RIGHTWARDS PAIRED ARROWS
    [/\u8650/g, '&ddarr;'], // DOWNWARDS PAIRED ARROWS
    [/\u8651/g, '&lrhar;'], // LEFTWARDS HARPOON OVER RIGHTWARDS HARPOON
    [/\u8652/g, '&rlhar;'], // RIGHTWARDS HARPOON OVER LEFTWARDS HARPOON
    [/\u8653/g, '&nlArr;'], // LEFTWARDS DOUBLE ARROW WITH STROKE
    [/\u8654/g, '&nhArr;'], // LEFT RIGHT DOUBLE ARROW WITH STROKE
    [/\u8655/g, '&nrArr;'], // RIGHTWARDS DOUBLE ARROW WITH STROKE
    [/\u8656/g, '&lArr;'], // LEFTWARDS DOUBLE ARROW
    [/\u8657/g, '&uArr;'], // UPWARDS DOUBLE ARROW
    [/\u8658/g, '&rArr;'], // RIGHTWARDS DOUBLE ARROW
    [/\u8659/g, '&dArr;'], // DOWNWARDS DOUBLE ARROW
    [/\u8660/g, '&hArr;'], // LEFT RIGHT DOUBLE ARROW
    [/\u8661/g, '&vArr;'], // UP DOWN DOUBLE ARROW
    [/\u8662/g, '&nwArr;'], // NORTH WEST DOUBLE ARROW
    [/\u8663/g, '&neArr;'], // NORTH EAST DOUBLE ARROW
    [/\u8664/g, '&seArr;'], // SOUTH EAST DOUBLE ARROW
    [/\u8665/g, '&swArr;'], // SOUTH WEST DOUBLE ARROW
    [/\u8666/g, '&lAarr;'], // LEFTWARDS TRIPLE ARROW
    [/\u8667/g, '&rAarr;'], // RIGHTWARDS TRIPLE ARROW
    [/\u8669/g, '&zigrarr;'], // RIGHTWARDS SQUIGGLE ARROW
    [/\u8676/g, '&larrb;'], // LEFTWARDS ARROW TO BAR
    [/\u8677/g, '&rarrb;'], // RIGHTWARDS ARROW TO BAR
    [/\u8693/g, '&duarr;'], // DOWNWARDS ARROW LEFTWARDS OF UPWARDS ARROW
    [/\u8701/g, '&loarr;'], // LEFTWARDS OPEN-HEADED ARROW
    [/\u8702/g, '&roarr;'], // RIGHTWARDS OPEN-HEADED ARROW
    [/\u8703/g, '&hoarr;'], // LEFT RIGHT OPEN-HEADED ARROW
    [/\u8704/g, '&forall;'], // FOR ALL
    [/\u8705/g, '&comp;'], // COMPLEMENT
    [/\u8706/g, '&part;'], // PARTIAL DIFFERENTIAL
    [/\u8707/g, '&exist;'], // THERE EXISTS
    [/\u8708/g, '&nexist;'], // THERE DOES NOT EXIST
    [/\u8709/g, '&empty;'], // EMPTY SET
    [/\u8711/g, '&nabla;'], // NABLA
    [/\u8712/g, '&isin;'], // ELEMENT OF
    [/\u8713/g, '&notin;'], // NOT AN ELEMENT OF
    [/\u8715/g, '&niv;'], // CONTAINS AS MEMBER
    [/\u8716/g, '&notni;'], // DOES NOT CONTAIN AS MEMBER
    [/\u8719/g, '&prod;'], // N-ARY PRODUCT
    [/\u8720/g, '&coprod;'], // N-ARY COPRODUCT
    [/\u8721/g, '&sum;'], // N-ARY SUMMATION
    [/\u8722/g, '&minus;'], // MINUS SIGN
    [/\u8723/g, '&mnplus;'], // MINUS-OR-PLUS SIGN
    [/\u8724/g, '&plusdo;'], // DOT PLUS
    [/\u8726/g, '&setmn;'], // SET MINUS
    [/\u8727/g, '&lowast;'], // ASTERISK OPERATOR
    [/\u8728/g, '&compfn;'], // RING OPERATOR
    [/\u8730/g, '&radic;'], // SQUARE ROOT
    [/\u8733/g, '&prop;'], // PROPORTIONAL TO
    [/\u8734/g, '&infin;'], // INFINITY
    [/\u8735/g, '&angrt;'], // RIGHT ANGLE
    [/\u8736/g, '&ang;'], // ANGLE
    [/\u8737/g, '&angmsd;'], // MEASURED ANGLE
    [/\u8738/g, '&angsph;'], // SPHERICAL ANGLE
    [/\u8739/g, '&mid;'], // DIVIDES
    [/\u8740/g, '&nmid;'], // DOES NOT DIVIDE
    [/\u8741/g, '&par;'], // PARALLEL TO
    [/\u8742/g, '&npar;'], // NOT PARALLEL TO
    [/\u8743/g, '&and;'], // LOGICAL AND
    [/\u8744/g, '&or;'], // LOGICAL OR
    [/\u8745/g, '&cap;'], // INTERSECTION
    [/\u8746/g, '&cup;'], // UNION
    [/\u8747/g, '&int;'], // INTEGRAL
    [/\u8748/g, '&Int;'], // DOUBLE INTEGRAL
    [/\u8749/g, '&tint;'], // TRIPLE INTEGRAL
    [/\u8750/g, '&conint;'], // CONTOUR INTEGRAL
    [/\u8751/g, '&Conint;'], // SURFACE INTEGRAL
    [/\u8752/g, '&Cconint;'], // VOLUME INTEGRAL
    [/\u8753/g, '&cwint;'], // CLOCKWISE INTEGRAL
    [/\u8754/g, '&cwconint;'], // CLOCKWISE CONTOUR INTEGRAL
    [/\u8755/g, '&awconint;'], // ANTICLOCKWISE CONTOUR INTEGRAL
    [/\u8756/g, '&there4;'], // THEREFORE
    [/\u8757/g, '&becaus;'], // BECAUSE
    [/\u8758/g, '&ratio;'], // RATIO
    [/\u8759/g, '&Colon;'], // PROPORTION
    [/\u8760/g, '&minusd;'], // DOT MINUS
    [/\u8762/g, '&mDDot;'], // GEOMETRIC PROPORTION
    [/\u8763/g, '&homtht;'], // HOMOTHETIC
    [/\u8764/g, '&sim;'], // TILDE OPERATOR
    [/\u8765/g, '&bsim;'], // REVERSED TILDE
    [/\u8766/g, '&ac;'], // INVERTED LAZY S
    [/\u8767/g, '&acd;'], // SINE WAVE
    [/\u8768/g, '&wreath;'], // WREATH PRODUCT
    [/\u8769/g, '&nsim;'], // NOT TILDE
    [/\u8770/g, '&esim;'], // MINUS TILDE
    [/\u8771/g, '&sime;'], // ASYMPTOTICALLY EQUAL TO
    [/\u8772/g, '&nsime;'], // NOT ASYMPTOTICALLY EQUAL TO
    [/\u8773/g, '&cong;'], // APPROXIMATELY EQUAL TO
    [/\u8774/g, '&simne;'], // APPROXIMATELY BUT NOT ACTUALLY EQUAL TO
    [/\u8775/g, '&ncong;'], // NEITHER APPROXIMATELY NOR ACTUALLY EQUAL TO
    [/\u8776/g, '&asymp;'], // ALMOST EQUAL TO
    [/\u8777/g, '&nap;'], // NOT ALMOST EQUAL TO
    [/\u8778/g, '&ape;'], // ALMOST EQUAL OR EQUAL TO
    [/\u8779/g, '&apid;'], // TRIPLE TILDE
    [/\u8780/g, '&bcong;'], // ALL EQUAL TO
    [/\u8781/g, '&asympeq;'], // EQUIVALENT TO
    [/\u8782/g, '&bump;'], // GEOMETRICALLY EQUIVALENT TO
    [/\u8783/g, '&bumpe;'], // DIFFERENCE BETWEEN
    [/\u8784/g, '&esdot;'], // APPROACHES THE LIMIT
    [/\u8785/g, '&eDot;'], // GEOMETRICALLY EQUAL TO
    [/\u8786/g, '&efDot;'], // APPROXIMATELY EQUAL TO OR THE IMAGE OF
    [/\u8787/g, '&erDot;'], // IMAGE OF OR APPROXIMATELY EQUAL TO
    [/\u8788/g, '&colone;'], // COLON EQUALS
    [/\u8789/g, '&ecolon;'], // EQUALS COLON
    [/\u8790/g, '&ecir;'], // RING IN EQUAL TO
    [/\u8791/g, '&cire;'], // RING EQUAL TO
    [/\u8793/g, '&wedgeq;'], // ESTIMATES
    [/\u8794/g, '&veeeq;'], // EQUIANGULAR TO
    [/\u8796/g, '&trie;'], // DELTA EQUAL TO
    [/\u8799/g, '&equest;'], // QUESTIONED EQUAL TO
    [/\u8800/g, '&ne;'], // NOT EQUAL TO
    [/\u8801/g, '&equiv;'], // IDENTICAL TO
    [/\u8802/g, '&nequiv;'], // NOT IDENTICAL TO
    [/\u8804/g, '&le;'], // LESS-THAN OR EQUAL TO
    [/\u8805/g, '&ge;'], // GREATER-THAN OR EQUAL TO
    [/\u8806/g, '&lE;'], // LESS-THAN OVER EQUAL TO
    [/\u8807/g, '&gE;'], // GREATER-THAN OVER EQUAL TO
    [/\u8808/g, '&lnE;'], // LESS-THAN BUT NOT EQUAL TO
    [/\u8809/g, '&gnE;'], // GREATER-THAN BUT NOT EQUAL TO
    [/\u8810/g, '&Lt;'], // MUCH LESS-THAN
    [/\u8811/g, '&Gt;'], // MUCH GREATER-THAN
    [/\u8812/g, '&twixt;'], // BETWEEN
    [/\u8813/g, '&NotCupCap;'], // NOT EQUIVALENT TO
    [/\u8814/g, '&nlt;'], // NOT LESS-THAN
    [/\u8815/g, '&ngt;'], // NOT GREATER-THAN
    [/\u8816/g, '&nle;'], // NEITHER LESS-THAN NOR EQUAL TO
    [/\u8817/g, '&nge;'], // NEITHER GREATER-THAN NOR EQUAL TO
    [/\u8818/g, '&lsim;'], // LESS-THAN OR EQUIVALENT TO
    [/\u8819/g, '&gsim;'], // GREATER-THAN OR EQUIVALENT TO
    [/\u8820/g, '&nlsim;'], // NEITHER LESS-THAN NOR EQUIVALENT TO
    [/\u8821/g, '&ngsim;'], // NEITHER GREATER-THAN NOR EQUIVALENT TO
    [/\u8822/g, '&lg;'], // LESS-THAN OR GREATER-THAN
    [/\u8823/g, '&gl;'], // GREATER-THAN OR LESS-THAN
    [/\u8824/g, '&ntlg;'], // NEITHER LESS-THAN NOR GREATER-THAN
    [/\u8825/g, '&ntgl;'], // NEITHER GREATER-THAN NOR LESS-THAN
    [/\u8826/g, '&pr;'], // PRECEDES
    [/\u8827/g, '&sc;'], // SUCCEEDS
    [/\u8828/g, '&prcue;'], // PRECEDES OR EQUAL TO
    [/\u8829/g, '&sccue;'], // SUCCEEDS OR EQUAL TO
    [/\u8830/g, '&prsim;'], // PRECEDES OR EQUIVALENT TO
    [/\u8831/g, '&scsim;'], // SUCCEEDS OR EQUIVALENT TO
    [/\u8832/g, '&npr;'], // DOES NOT PRECEDE
    [/\u8833/g, '&nsc;'], // DOES NOT SUCCEED
    [/\u8834/g, '&sub;'], // SUBSET OF
    [/\u8835/g, '&sup;'], // SUPERSET OF
    [/\u8836/g, '&nsub;'], // NOT A SUBSET OF
    [/\u8837/g, '&nsup;'], // NOT A SUPERSET OF
    [/\u8838/g, '&sube;'], // SUBSET OF OR EQUAL TO
    [/\u8839/g, '&supe;'], // SUPERSET OF OR EQUAL TO
    [/\u8840/g, '&nsube;'], // NEITHER A SUBSET OF NOR EQUAL TO
    [/\u8841/g, '&nsupe;'], // NEITHER A SUPERSET OF NOR EQUAL TO
    [/\u8842/g, '&subne;'], // SUBSET OF WITH NOT EQUAL TO
    [/\u8843/g, '&supne;'], // SUPERSET OF WITH NOT EQUAL TO
    [/\u8845/g, '&cupdot;'], // MULTISET MULTIPLICATION
    [/\u8846/g, '&uplus;'], // MULTISET UNION
    [/\u8847/g, '&sqsub;'], // SQUARE IMAGE OF
    [/\u8848/g, '&sqsup;'], // SQUARE ORIGINAL OF
    [/\u8849/g, '&sqsube;'], // SQUARE IMAGE OF OR EQUAL TO
    [/\u8850/g, '&sqsupe;'], // SQUARE ORIGINAL OF OR EQUAL TO
    [/\u8851/g, '&sqcap;'], // SQUARE CAP
    [/\u8852/g, '&sqcup;'], // SQUARE CUP
    [/\u8853/g, '&oplus;'], // CIRCLED PLUS
    [/\u8854/g, '&ominus;'], // CIRCLED MINUS
    [/\u8855/g, '&otimes;'], // CIRCLED TIMES
    [/\u8856/g, '&osol;'], // CIRCLED DIVISION SLASH
    [/\u8857/g, '&odot;'], // CIRCLED DOT OPERATOR
    [/\u8858/g, '&ocir;'], // CIRCLED RING OPERATOR
    [/\u8859/g, '&oast;'], // CIRCLED ASTERISK OPERATOR
    [/\u8861/g, '&odash;'], // CIRCLED DASH
    [/\u8862/g, '&plusb;'], // SQUARED PLUS
    [/\u8863/g, '&minusb;'], // SQUARED MINUS
    [/\u8864/g, '&timesb;'], // SQUARED TIMES
    [/\u8865/g, '&sdotb;'], // SQUARED DOT OPERATOR
    [/\u8866/g, '&vdash;'], // RIGHT TACK
    [/\u8867/g, '&dashv;'], // LEFT TACK
    [/\u8868/g, '&top;'], // DOWN TACK
    [/\u8869/g, '&bottom;'], // UP TACK
    [/\u8871/g, '&models;'], // MODELS
    [/\u8872/g, '&vDash;'], // TRUE
    [/\u8873/g, '&Vdash;'], // FORCES
    [/\u8874/g, '&Vvdash;'], // TRIPLE VERTICAL BAR RIGHT TURNSTILE
    [/\u8875/g, '&VDash;'], // DOUBLE VERTICAL BAR DOUBLE RIGHT TURNSTILE
    [/\u8876/g, '&nvdash;'], // DOES NOT PROVE
    [/\u8877/g, '&nvDash;'], // NOT TRUE
    [/\u8878/g, '&nVdash;'], // DOES NOT FORCE
    [/\u8879/g, '&nVDash;'], // NEGATED DOUBLE VERTICAL BAR DOUBLE RIGHT TURNSTILE
    [/\u8880/g, '&prurel;'], // PRECEDES UNDER RELATION
    [/\u8882/g, '&vltri;'], // NORMAL SUBGROUP OF
    [/\u8883/g, '&vrtri;'], // CONTAINS AS NORMAL SUBGROUP
    [/\u8884/g, '&ltrie;'], // NORMAL SUBGROUP OF OR EQUAL TO
    [/\u8885/g, '&rtrie;'], // CONTAINS AS NORMAL SUBGROUP OR EQUAL TO
    [/\u8886/g, '&origof;'], // ORIGINAL OF
    [/\u8887/g, '&imof;'], // IMAGE OF
    [/\u8888/g, '&mumap;'], // MULTIMAP
    [/\u8889/g, '&hercon;'], // HERMITIAN CONJUGATE MATRIX
    [/\u8890/g, '&intcal;'], // INTERCALATE
    [/\u8891/g, '&veebar;'], // XOR
    [/\u8893/g, '&barvee;'], // NOR
    [/\u8894/g, '&angrtvb;'], // RIGHT ANGLE WITH ARC
    [/\u8895/g, '&lrtri;'], // RIGHT TRIANGLE
    [/\u8896/g, '&xwedge;'], // N-ARY LOGICAL AND
    [/\u8897/g, '&xvee;'], // N-ARY LOGICAL OR
    [/\u8898/g, '&xcap;'], // N-ARY INTERSECTION
    [/\u8899/g, '&xcup;'], // N-ARY UNION
    [/\u8900/g, '&diam;'], // DIAMOND OPERATOR
    [/\u8901/g, '&sdot;'], // DOT OPERATOR
    [/\u8902/g, '&sstarf;'], // STAR OPERATOR
    [/\u8903/g, '&divonx;'], // DIVISION TIMES
    [/\u8904/g, '&bowtie;'], // BOWTIE
    [/\u8905/g, '&ltimes;'], // LEFT NORMAL FACTOR SEMIDIRECT PRODUCT
    [/\u8906/g, '&rtimes;'], // RIGHT NORMAL FACTOR SEMIDIRECT PRODUCT
    [/\u8907/g, '&lthree;'], // LEFT SEMIDIRECT PRODUCT
    [/\u8908/g, '&rthree;'], // RIGHT SEMIDIRECT PRODUCT
    [/\u8909/g, '&bsime;'], // REVERSED TILDE EQUALS
    [/\u8910/g, '&cuvee;'], // CURLY LOGICAL OR
    [/\u8911/g, '&cuwed;'], // CURLY LOGICAL AND
    [/\u8912/g, '&Sub;'], // DOUBLE SUBSET
    [/\u8913/g, '&Sup;'], // DOUBLE SUPERSET
    [/\u8914/g, '&Cap;'], // DOUBLE INTERSECTION
    [/\u8915/g, '&Cup;'], // DOUBLE UNION
    [/\u8916/g, '&fork;'], // PITCHFORK
    [/\u8917/g, '&epar;'], // EQUAL AND PARALLEL TO
    [/\u8918/g, '&ltdot;'], // LESS-THAN WITH DOT
    [/\u8919/g, '&gtdot;'], // GREATER-THAN WITH DOT
    [/\u8920/g, '&Ll;'], // VERY MUCH LESS-THAN
    [/\u8921/g, '&Gg;'], // VERY MUCH GREATER-THAN
    [/\u8922/g, '&leg;'], // LESS-THAN EQUAL TO OR GREATER-THAN
    [/\u8923/g, '&gel;'], // GREATER-THAN EQUAL TO OR LESS-THAN
    [/\u8926/g, '&cuepr;'], // EQUAL TO OR PRECEDES
    [/\u8927/g, '&cuesc;'], // EQUAL TO OR SUCCEEDS
    [/\u8928/g, '&nprcue;'], // DOES NOT PRECEDE OR EQUAL
    [/\u8929/g, '&nsccue;'], // DOES NOT SUCCEED OR EQUAL
    [/\u8930/g, '&nsqsube;'], // NOT SQUARE IMAGE OF OR EQUAL TO
    [/\u8931/g, '&nsqsupe;'], // NOT SQUARE ORIGINAL OF OR EQUAL TO
    [/\u8934/g, '&lnsim;'], // LESS-THAN BUT NOT EQUIVALENT TO
    [/\u8935/g, '&gnsim;'], // GREATER-THAN BUT NOT EQUIVALENT TO
    [/\u8936/g, '&prnsim;'], // PRECEDES BUT NOT EQUIVALENT TO
    [/\u8937/g, '&scnsim;'], // SUCCEEDS BUT NOT EQUIVALENT TO
    [/\u8938/g, '&nltri;'], // NOT NORMAL SUBGROUP OF
    [/\u8939/g, '&nrtri;'], // DOES NOT CONTAIN AS NORMAL SUBGROUP
    [/\u8940/g, '&nltrie;'], // NOT NORMAL SUBGROUP OF OR EQUAL TO
    [/\u8941/g, '&nrtrie;'], // DOES NOT CONTAIN AS NORMAL SUBGROUP OR EQUAL
    [/\u8942/g, '&vellip;'], // VERTICAL ELLIPSIS
    [/\u8943/g, '&ctdot;'], // MIDLINE HORIZONTAL ELLIPSIS
    [/\u8944/g, '&utdot;'], // UP RIGHT DIAGONAL ELLIPSIS
    [/\u8945/g, '&dtdot;'], // DOWN RIGHT DIAGONAL ELLIPSIS
    [/\u8946/g, '&disin;'], // ELEMENT OF WITH LONG HORIZONTAL STROKE
    [/\u8947/g, '&isinsv;'], // ELEMENT OF WITH VERTICAL BAR AT END OF HORIZONTAL STROKE
    [/\u8948/g, '&isins;'], // SMALL ELEMENT OF WITH VERTICAL BAR AT END OF HORIZONTAL STROKE
    [/\u8949/g, '&isindot;'], // ELEMENT OF WITH DOT ABOVE
    [/\u8950/g, '&notinvc;'], // ELEMENT OF WITH OVERBAR
    [/\u8951/g, '&notinvb;'], // SMALL ELEMENT OF WITH OVERBAR
    [/\u8953/g, '&isinE;'], // ELEMENT OF WITH TWO HORIZONTAL STROKES
    [/\u8954/g, '&nisd;'], // CONTAINS WITH LONG HORIZONTAL STROKE
    [/\u8955/g, '&xnis;'], // CONTAINS WITH VERTICAL BAR AT END OF HORIZONTAL STROKE
    [/\u8956/g, '&nis;'], // SMALL CONTAINS WITH VERTICAL BAR AT END OF HORIZONTAL STROKE
    [/\u8957/g, '&notnivc;'], // CONTAINS WITH OVERBAR
    [/\u8958/g, '&notnivb;'], // SMALL CONTAINS WITH OVERBAR
    [/\u8965/g, '&barwed;'], // PROJECTIVE
    [/\u8966/g, '&Barwed;'], // PERSPECTIVE
    [/\u8968/g, '&lceil;'], // LEFT CEILING
    [/\u8969/g, '&rceil;'], // RIGHT CEILING
    [/\u8970/g, '&lfloor;'], // LEFT FLOOR
    [/\u8971/g, '&rfloor;'], // RIGHT FLOOR
    [/\u8972/g, '&drcrop;'], // BOTTOM RIGHT CROP
    [/\u8973/g, '&dlcrop;'], // BOTTOM LEFT CROP
    [/\u8974/g, '&urcrop;'], // TOP RIGHT CROP
    [/\u8975/g, '&ulcrop;'], // TOP LEFT CROP
    [/\u8976/g, '&bnot;'], // REVERSED NOT SIGN
    [/\u8978/g, '&profline;'], // ARC
    [/\u8979/g, '&profsurf;'], // SEGMENT
    [/\u8981/g, '&telrec;'], // TELEPHONE RECORDER
    [/\u8982/g, '&target;'], // POSITION INDICATOR
    [/\u8988/g, '&ulcorn;'], // TOP LEFT CORNER
    [/\u8989/g, '&urcorn;'], // TOP RIGHT CORNER
    [/\u8990/g, '&dlcorn;'], // BOTTOM LEFT CORNER
    [/\u8991/g, '&drcorn;'], // BOTTOM RIGHT CORNER
    [/\u8994/g, '&frown;'], // FROWN
    [/\u8995/g, '&smile;'], // SMILE
    [/\u9005/g, '&cylcty;'], // CYLINDRICITY
    [/\u9006/g, '&profalar;'], // ALL AROUND-PROFILE
    [/\u9014/g, '&topbot;'], // APL FUNCTIONAL SYMBOL I-BEAM
    [/\u9021/g, '&ovbar;'], // APL FUNCTIONAL SYMBOL CIRCLE STILE
    [/\u9023/g, '&solbar;'], // APL FUNCTIONAL SYMBOL SLASH BAR
    [/\u9084/g, '&angzarr;'], // RIGHT ANGLE WITH DOWNWARDS ZIGZAG ARROW
    [/\u9136/g, '&lmoust;'], // UPPER LEFT OR LOWER RIGHT CURLY BRACKET SECTION
    [/\u9137/g, '&rmoust;'], // UPPER RIGHT OR LOWER LEFT CURLY BRACKET SECTION
    [/\u9140/g, '&tbrk;'], // TOP SQUARE BRACKET
    [/\u9141/g, '&bbrk;'], // BOTTOM SQUARE BRACKET
    [/\u9142/g, '&bbrktbrk;'], // BOTTOM SQUARE BRACKET OVER TOP SQUARE BRACKET
    [/\u9180/g, '&OverParenthesis;'], // TOP PARENTHESIS
    [/\u9181/g, '&UnderParenthesis;'], // BOTTOM PARENTHESIS
    [/\u9182/g, '&OverBrace;'], // TOP CURLY BRACKET
    [/\u9183/g, '&UnderBrace;'], // BOTTOM CURLY BRACKET
    [/\u9186/g, '&trpezium;'], // WHITE TRAPEZIUM
    [/\u9191/g, '&elinters;'], // ELECTRICAL INTERSECTION
    [/\u9251/g, '&blank;'], // OPEN BOX
    [/\u9416/g, '&oS;'], // CIRCLED LATIN CAPITAL LETTER S
    [/\u9472/g, '&boxh;'], // BOX DRAWINGS LIGHT HORIZONTAL
    [/\u9474/g, '&boxv;'], // BOX DRAWINGS LIGHT VERTICAL
    [/\u9484/g, '&boxdr;'], // BOX DRAWINGS LIGHT DOWN AND RIGHT
    [/\u9488/g, '&boxdl;'], // BOX DRAWINGS LIGHT DOWN AND LEFT
    [/\u9492/g, '&boxur;'], // BOX DRAWINGS LIGHT UP AND RIGHT
    [/\u9496/g, '&boxul;'], // BOX DRAWINGS LIGHT UP AND LEFT
    [/\u9500/g, '&boxvr;'], // BOX DRAWINGS LIGHT VERTICAL AND RIGHT
    [/\u9508/g, '&boxvl;'], // BOX DRAWINGS LIGHT VERTICAL AND LEFT
    [/\u9516/g, '&boxhd;'], // BOX DRAWINGS LIGHT DOWN AND HORIZONTAL
    [/\u9524/g, '&boxhu;'], // BOX DRAWINGS LIGHT UP AND HORIZONTAL
    [/\u9532/g, '&boxvh;'], // BOX DRAWINGS LIGHT VERTICAL AND HORIZONTAL
    [/\u9552/g, '&boxH;'], // BOX DRAWINGS DOUBLE HORIZONTAL
    [/\u9553/g, '&boxV;'], // BOX DRAWINGS DOUBLE VERTICAL
    [/\u9554/g, '&boxdR;'], // BOX DRAWINGS DOWN SINGLE AND RIGHT DOUBLE
    [/\u9555/g, '&boxDr;'], // BOX DRAWINGS DOWN DOUBLE AND RIGHT SINGLE
    [/\u9556/g, '&boxDR;'], // BOX DRAWINGS DOUBLE DOWN AND RIGHT
    [/\u9557/g, '&boxdL;'], // BOX DRAWINGS DOWN SINGLE AND LEFT DOUBLE
    [/\u9558/g, '&boxDl;'], // BOX DRAWINGS DOWN DOUBLE AND LEFT SINGLE
    [/\u9559/g, '&boxDL;'], // BOX DRAWINGS DOUBLE DOWN AND LEFT
    [/\u9560/g, '&boxuR;'], // BOX DRAWINGS UP SINGLE AND RIGHT DOUBLE
    [/\u9561/g, '&boxUr;'], // BOX DRAWINGS UP DOUBLE AND RIGHT SINGLE
    [/\u9562/g, '&boxUR;'], // BOX DRAWINGS DOUBLE UP AND RIGHT
    [/\u9563/g, '&boxuL;'], // BOX DRAWINGS UP SINGLE AND LEFT DOUBLE
    [/\u9564/g, '&boxUl;'], // BOX DRAWINGS UP DOUBLE AND LEFT SINGLE
    [/\u9565/g, '&boxUL;'], // BOX DRAWINGS DOUBLE UP AND LEFT
    [/\u9566/g, '&boxvR;'], // BOX DRAWINGS VERTICAL SINGLE AND RIGHT DOUBLE
    [/\u9567/g, '&boxVr;'], // BOX DRAWINGS VERTICAL DOUBLE AND RIGHT SINGLE
    [/\u9568/g, '&boxVR;'], // BOX DRAWINGS DOUBLE VERTICAL AND RIGHT
    [/\u9569/g, '&boxvL;'], // BOX DRAWINGS VERTICAL SINGLE AND LEFT DOUBLE
    [/\u9570/g, '&boxVl;'], // BOX DRAWINGS VERTICAL DOUBLE AND LEFT SINGLE
    [/\u9571/g, '&boxVL;'], // BOX DRAWINGS DOUBLE VERTICAL AND LEFT
    [/\u9572/g, '&boxHd;'], // BOX DRAWINGS DOWN SINGLE AND HORIZONTAL DOUBLE
    [/\u9573/g, '&boxhD;'], // BOX DRAWINGS DOWN DOUBLE AND HORIZONTAL SINGLE
    [/\u9574/g, '&boxHD;'], // BOX DRAWINGS DOUBLE DOWN AND HORIZONTAL
    [/\u9575/g, '&boxHu;'], // BOX DRAWINGS UP SINGLE AND HORIZONTAL DOUBLE
    [/\u9576/g, '&boxhU;'], // BOX DRAWINGS UP DOUBLE AND HORIZONTAL SINGLE
    [/\u9577/g, '&boxHU;'], // BOX DRAWINGS DOUBLE UP AND HORIZONTAL
    [/\u9578/g, '&boxvH;'], // BOX DRAWINGS VERTICAL SINGLE AND HORIZONTAL DOUBLE
    [/\u9579/g, '&boxVh;'], // BOX DRAWINGS VERTICAL DOUBLE AND HORIZONTAL SINGLE
    [/\u9580/g, '&boxVH;'], // BOX DRAWINGS DOUBLE VERTICAL AND HORIZONTAL
    [/\u9600/g, '&uhblk;'], // UPPER HALF BLOCK
    [/\u9604/g, '&lhblk;'], // LOWER HALF BLOCK
    [/\u9608/g, '&block;'], // FULL BLOCK
    [/\u9617/g, '&blk14;'], // LIGHT SHADE
    [/\u9618/g, '&blk12;'], // MEDIUM SHADE
    [/\u9619/g, '&blk34;'], // DARK SHADE
    [/\u9633/g, '&squ;'], // WHITE SQUARE
    [/\u9642/g, '&squf;'], // BLACK SMALL SQUARE
    [/\u9643/g, '&EmptyVerySmallSquare;'], // WHITE SMALL SQUARE
    [/\u9645/g, '&rect;'], // WHITE RECTANGLE
    [/\u9646/g, '&marker;'], // BLACK VERTICAL RECTANGLE
    [/\u9649/g, '&fltns;'], // WHITE PARALLELOGRAM
    [/\u9651/g, '&xutri;'], // WHITE UP-POINTING TRIANGLE
    [/\u9652/g, '&utrif;'], // BLACK UP-POINTING SMALL TRIANGLE
    [/\u9653/g, '&utri;'], // WHITE UP-POINTING SMALL TRIANGLE
    [/\u9656/g, '&rtrif;'], // BLACK RIGHT-POINTING SMALL TRIANGLE
    [/\u9657/g, '&rtri;'], // WHITE RIGHT-POINTING SMALL TRIANGLE
    [/\u9661/g, '&xdtri;'], // WHITE DOWN-POINTING TRIANGLE
    [/\u9662/g, '&dtrif;'], // BLACK DOWN-POINTING SMALL TRIANGLE
    [/\u9663/g, '&dtri;'], // WHITE DOWN-POINTING SMALL TRIANGLE
    [/\u9666/g, '&ltrif;'], // BLACK LEFT-POINTING SMALL TRIANGLE
    [/\u9667/g, '&ltri;'], // WHITE LEFT-POINTING SMALL TRIANGLE
    [/\u9674/g, '&loz;'], // LOZENGE
    [/\u9675/g, '&cir;'], // WHITE CIRCLE
    [/\u9708/g, '&tridot;'], // WHITE UP-POINTING TRIANGLE WITH DOT
    [/\u9711/g, '&xcirc;'], // LARGE CIRCLE
    [/\u9720/g, '&ultri;'], // UPPER LEFT TRIANGLE
    [/\u9721/g, '&urtri;'], // UPPER RIGHT TRIANGLE
    [/\u9722/g, '&lltri;'], // LOWER LEFT TRIANGLE
    [/\u9723/g, '&EmptySmallSquare;'], // WHITE MEDIUM SQUARE
    [/\u9724/g, '&FilledSmallSquare;'], // BLACK MEDIUM SQUARE
    [/\u9733/g, '&starf;'], // BLACK STAR
    [/\u9734/g, '&star;'], // WHITE STAR
    [/\u9742/g, '&phone;'], // BLACK TELEPHONE
    [/\u9792/g, '&female;'], // FEMALE SIGN
    [/\u9794/g, '&male;'], // MALE SIGN
    [/\u9824/g, '&spades;'], // BLACK SPADE SUIT
    [/\u9827/g, '&clubs;'], // BLACK CLUB SUIT
    [/\u9829/g, '&hearts;'], // BLACK HEART SUIT
    [/\u9830/g, '&diams;'], // BLACK DIAMOND SUIT
    [/\u9834/g, '&sung;'], // EIGHTH NOTE
    [/\u9837/g, '&flat;'], // MUSIC FLAT SIGN
    [/\u9838/g, '&natur;'], // MUSIC NATURAL SIGN
    [/\u9839/g, '&sharp;'], // MUSIC SHARP SIGN
    [/&/g, '&amp;']
  ]
  let output = input
  for (let a = 0; a < findReplace.length; a += 1) {
    output = output.replace(findReplace[a][0], findReplace[a][1])
  }
  return output
  // return findReplace.reduce((last, pair) => last.replace(pair[0], pair[1]))
}

doStuff.register({
  action: 'htmlSpecialChars',
  func: htmlSpecialChars,
  description: '',
  // docsURL: '',
  extraInputs: [],
  // group: '',
  ignore: false,
  // inputLabel: '',
  name: 'HTML Enchode special chars'
  // remote: false,
  // rawGet: false,
})

//  END: Action name
// ====================================================================
