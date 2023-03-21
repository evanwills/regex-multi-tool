
import { regexEngines as engines } from '../regexEngine-init.mjs'

/**
 * Get regexes to use on intput strings
 *
 * Function to pass to Array.Map for current list of regex-pairs
 *
 * @param {object} regex RegexPair object
 * @returns {object}
 */
const getUsableRegexes = (regex) => {
  const output = {
    ok: (regex.regex.error === '' && regex.flags.error === ''),
    regexp: null,
    replace: '',
    error: ''
  }

  if (output.ok === true) {
    output.regexp = new RegExp(regex.regex.pattern, regex.flags.flags)
    output.replace = regex.replace
  } else {
    let sep = ''
    if (regex.regex.error !== '') {
      output.error = regex.regex.error
      sep = ' & '
    }
    if (regex.flags.error !== '') {
      output.error = sep + regex.flags.error
    }
  }

  return output
}

const replaceReduce = (output, regex) => {
  return (regex.ok === true)
    ? output.replace(regex.regexp, regex.replace)
    : output
}

/**
 * Apply a single regular expression to a single sample string
 *
 * @param {string}      input string to match against
 * @param {RegexPair[]} regex RegexPair info
 *
 * @returns {Object}
 */
const matchSingle = (input, regex, regexIndex) => {
  const output = {
    regexIndex: regexIndex,
    output: '',
    matches: [],
    hasError: !regex.ok
  };

  if (regex.ok === true) {
    let tmp = [];

    output.output = input.replace(regex.regexp, regex.replace)

    let safety = 999999;

    while ((tmp = regex.regexp.exec(input)) !== null && safety > 0) {
      const groups = (typeof tmp.groups !== 'undefined')
        ? tmp.groups
        : null;

      // remove groups from the main list of captured sub-patterns
      const tmpMatches = tmp.filter((value, index) => (index !== 'groups'))
        .map((value, index) => {
          return {
            index: index,
            key: '',
            str: value
          }
        });

      safety -= 1;
      tmpMatches[0].key = '__WHOLE__'

      if (groups !== null) {
        /**
         * Index of the last matched group sub-pattern
         *
         * @var {number}
         */
        let c = 0
        for (const key in groups) {
          /**
           * Index of the sub-pattern this group (named sub-pattern)
           * matches
           *
           * @var {number}
           */
          const b = tmp.indexOf(groups[key], c)

          // If the index and string from the group pattern matches
          // the index and group string of the sub-pattern, then use
          // the group's key
          if (typeof tmpMatches[b] !== 'undefined' &&
              tmpMatches[b].index === b &&
              tmpMatches[b].str === tmp.groups[key]
          ) {
            tmpMatches[b].key = key
          }

          // Bump the starting index so we don't reuse a previously
          // used index.
          c = b + 1
        }
      }

      output.matches.push(tmpMatches)
    }
  }

  return output
}

/**
 * process all regexes against a single input string.
 *
 * @param {string} input text to apply regexes to.
 * @param {RegexPair[]} List of regexes
 *
 * @returns {Array} list of match data for every regex applied to
 *                  input
 */
const matchAll = (input, regexes) => {
  const output = []
  let str = input

  for (let a = 0; a < regexes.length; a += 1) {
    const tmp = matchSingle(str, regexes[a], a)
    str = tmp.output
    output.push(tmp)
  }

  return {
    input: input,
    matches: output
  }
}

function VanillaJS () {
  this.cleanError = (error) => {
    return error.message.replace(/^SyntaxError: /i, '')
  }

  /**
   * Test if the supplied regex pattern and flags are valid for the
   * this engine
   *
   * @param {array} regex Single regexPair object
   *
   * @return {string} If regex contains an error, error message is
   *               returned. Otherwise empty string is returned.
   */
  this.validate = function (pattern, flags) {
    try {
      const tmp = new RegExp(pattern, flags) // eslint-disable-line no-unused-vars
    } catch (error) {
      return this.cleanError(error)
    }
    return ''
  }

  /**
   * Test what the supplied regex is valid for the this engine
   *
   * @param {array} regex Single regexPair object
   *
   * @return {string} If regex contains an error, error message is
   *               returned. Otherwise empty string is returned.
   */
  this.validateRegex = function (regexPair) {
    try {
      const tmp = new RegExp(regexPair.regex.pattern, '') // eslint-disable-line no-unused-vars
    } catch (error) {
      return this.cleanError(error)
    }

    return ''
  }

  /**
   * Test what the supplied regex is valid for the this engine
   *
   * @param {array} regex Single regexPair object
   *
   * @return {string} If regex contains an error, error message is
   *               returned. Otherwise empty string is returned.
   */
  this.validateFlags = function (regexPair) {
    try {
      const tmp = new RegExp('', regexPair.flags.flags) // eslint-disable-line no-unused-vars
    } catch (error) {
      return this.cleanError(error)
    }
    return ''
  }

  /**
   * Test what the supplied regex is valid for the this engine
   *
   * @param {array} regex Single regexPair object
   *
   * @return {string} If regex contains an error, error message is
   *               returned. Otherwise empty string is returned.
   */
  this.validateDelims = function (regexPair) {
    return ''
  }

  /**
   * Test what the supplied regexes match from the supplied input
   *
   * @param {string[]} inputs  user supplied content (expects an
   *                           array of strings)
   * @param {array}    regexes array of regex pairs and their config
   *
   * @returns {array} modified version user input
   */
  this.match = function (inputs, regexes) {
    const regExps = regexes.map(getUsableRegexes)

    return {
      matches: inputs.map((input) => matchAll(input, regExps)),
      regexes: regexes
    }
  }

  /**
   * Run find & replace on supplied input using the supplied regexes
   *
   * @param {string[]} input user supplied content (expects an array of
   *               strings)
   * @param {array} regexes array of regex pairs and their config
   *
   * @returns {string[]} modified version user input
   */
  this.replace = function (input, regexes) {
    const regExps = regexes.map(getUsableRegexes)

    return input.map(str => regExps.reduce(replaceReduce, str))
  }
}

engines.register({
  id: 'VanillaJS',
  name: 'Vanilla JS RegExp',
  description: 'Built in Browser ECMA Script RegExp functionality',
  engine: new VanillaJS(),
  flags: {
    allow: true,
    default: 'ig'
  },
  delimiters: {
    allow: false,
    open: '',
    close: ''
  },
  chaining: {
    allow: true,
    default: true
  },
  remote: false,
  docsURL: '',
  allowMultiLine: false
})
